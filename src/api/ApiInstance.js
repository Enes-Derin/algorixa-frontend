import axios from "axios";
import tokenService from "../utils/tokenService";

const API_BASE_URL = "/api";

const apiInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false // JWT header ile çalışacağımız için cookie yok
});

// REQUEST INTERCEPTOR
apiInstance.interceptors.request.use(
    async (config) => {
        // Süresi dolmuş token varsa temizle
        tokenService.clearExpiredTokenFromStorage();

        // Token yenileme gerekli mi?
        if (tokenService.shouldRefreshToken() && tokenService.getRefreshToken()) {
            try {
                const refreshResponse = await axios.post(
                    `${API_BASE_URL}/auth/refreshToken`,
                    { refreshToken: tokenService.getRefreshToken() }
                );

                const { accessToken, refreshToken } = refreshResponse.data.data;
                tokenService.updateTokens(accessToken, refreshToken);
            } catch (error) {
                console.error("Token refresh başarısız:", error);
                tokenService.clearAllTokens();
                return Promise.reject(error);
            }
        }

        // Authorization header ekle
        const token = tokenService.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 hatası ve refresh token varsa retry
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            tokenService.getRefreshToken()
        ) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await axios.post(
                    `${API_BASE_URL}/auth/refreshToken`,
                    { refreshToken: tokenService.getRefreshToken() }
                );
                const { accessToken, refreshToken } = refreshResponse.data.data;
                tokenService.updateTokens(accessToken, refreshToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiInstance(originalRequest);
            } catch (refreshError) {
                tokenService.clearAllTokens();
                return Promise.reject(refreshError);
            }
        }

        if (error.response?.status === 401) {
            tokenService.clearAllTokens();
        }

        return Promise.reject(error);
    }
);

export default apiInstance;