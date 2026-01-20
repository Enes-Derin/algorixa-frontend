import axios from "axios";
import { store } from "../redux/store";
import { setAccessToken, logout } from "../redux/authSlice";

const API_BASE_URL = "/api";

const apiInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true // HTTP-only cookies otomatik gönderilir
});

// REQUEST INTERCEPTOR - Token'ı header'a ekle
apiInstance.interceptors.request.use(
    (config) => {
        // Redux state'ten veya sessionStorage'dan token al
        const token = store.getState().auth.accessToken || sessionStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR - Token refresh
apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 hatası ve daha önce retry yapılmadıysa
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                // Backend'e refresh token gönderi (cookie'de otomatik gider)
                const refreshResponse = await axios.post(
                    `${API_BASE_URL}/auth/refreshToken`,
                    {},
                    { withCredentials: true }
                );

                const newAccessToken = refreshResponse.data.data.accessToken;

                // Yeni token'ı Redux'a kaydet (memory'de tutuluyor)
                store.dispatch(setAccessToken(newAccessToken));

                // Orijinal request'i yeni token ile tekrar gönder
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiInstance(originalRequest);

            } catch (refreshError) {
                // Refresh başarısız → Logout
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiInstance;
