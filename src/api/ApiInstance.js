// api/apiInstance.js
import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "../utils/tokenService";

const BASE_URL = "/api";

const apiInstance = axios.create({
    baseURL: BASE_URL,
    // withCredentials: true // JWT header kullanıyoruz, gerek yok
});

// Request interceptor: JWT header ekle
apiInstance.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Response interceptor: 401 → token refresh
apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && getRefreshToken()) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await axios.post(`${BASE_URL}/auth/refreshToken`, {
                    refreshToken: getRefreshToken()
                });

                const { accessToken, refreshToken } = refreshResponse.data.data;
                setTokens(accessToken, refreshToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiInstance(originalRequest);
            } catch (refreshError) {
                clearTokens();
                window.location.replace("/login");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiInstance;
