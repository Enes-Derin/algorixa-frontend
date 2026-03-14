import axios from "axios";
import tokenService from "../utils/tokenService";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const apiInstance = axios.create({
    baseURL: API_BASE_URL
});

apiInstance.interceptors.request.use(
    async (config) => {
        tokenService.clearExpiredTokenFromStorage();

        if (tokenService.shouldRefreshToken() && tokenService.getRefreshToken()) {
            try {
                const refreshResponse = await axios.post(
                    `${API_BASE_URL}/auth/refreshToken`,
                    { refreshToken: tokenService.getRefreshToken() }
                );
                const { accessToken, refreshToken } = refreshResponse.data.data;
                tokenService.updateTokens(accessToken, refreshToken);
            } catch (error) {
                tokenService.clearAllTokens();
                return Promise.reject(error);
            }
        }

        const token = tokenService.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

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