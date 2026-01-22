import axios from "axios";
import tokenService from "../utils/tokenService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiInstance = axios.create({
    baseURL: API_BASE_URL
});

// REQUEST INTERCEPTOR - Token'ı header'a ekle ve süresi dolmak üzerseyse yenile
apiInstance.interceptors.request.use(
    async (config) => {
        // Önce token süresi dolmuşsa temizle
        tokenService.clearExpiredTokenFromStorage();

        // Yenilenmesi gereken token var mı kontrol et
        if (tokenService.shouldRefreshToken() && tokenService.getRefreshToken()) {
            try {
                // Token'ı yenile
                const refreshResponse = await axios.post(
                    `${API_BASE_URL}/auth/refreshToken`,
                    { refreshToken: tokenService.getRefreshToken() },
                    { withCredentials: true }
                );

                const { accessToken, refreshToken } = refreshResponse.data.data;
                tokenService.updateTokens(accessToken, refreshToken);
            } catch (error) {
                console.error("Token refresh başarısız:", error);
                tokenService.clearAllTokens();
                return Promise.reject(error);
            }
        }

        // Token'ı header'a ekle
        const token = tokenService.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR - 401 hatası ve token refresh işlemi
apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 hatası ve daha önce retry yapılmadıysa
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            tokenService.getRefreshToken()
        ) {
            originalRequest._retry = true;

            try {
                // Backend'e refresh token gönderi
                const refreshResponse = await axios.post(
                    `${API_BASE_URL}/auth/refreshToken`,
                    { refreshToken: tokenService.getRefreshToken() },
                    { withCredentials: true }
                );

                const { accessToken, refreshToken } = refreshResponse.data.data;

                // Token'ları güncelle
                tokenService.updateTokens(accessToken, refreshToken);

                // Orijinal request'i yeni token ile tekrar gönder
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiInstance(originalRequest);

            } catch (refreshError) {
                // Refresh başarısız → Logout yap ve tüm token'ları temizle
                tokenService.clearAllTokens();
                return Promise.reject(refreshError);
            }
        }

        // Refresh token da yoksa veya başarısız olduysa logout
        if (error.response?.status === 401) {
            tokenService.clearAllTokens();
        }

        return Promise.reject(error);
    }
);

export default apiInstance;
