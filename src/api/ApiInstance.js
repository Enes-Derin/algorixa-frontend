import axios from "axios";
import {
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearTokens
} from "./../utils/tokenService";

const BASE_URL = "/api";

/* =====================
   AXIOS INSTANCE
===================== */
const apiInstance = axios.create({
    baseURL: BASE_URL,
});

/* =====================
   MULTIPART HELPERS
===================== */
export const postMultipart = async (url, formData) => {
    const token = getAccessToken();
    const response = await apiInstance.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });
    return response.data;
};

export const putMultipart = async (url, formData) => {
    const token = getAccessToken();
    const response = await apiInstance.put(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });
    return response.data;
};

/* =====================
   REFRESH TOKEN LOGIC
===================== */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(promise =>
        error ? promise.reject(error) : promise.resolve(token)
    );
    failedQueue = [];
};

/* =====================
   REQUEST INTERCEPTOR
===================== */
apiInstance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/* =====================
   RESPONSE INTERCEPTOR
===================== */
apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiInstance(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = getRefreshToken();

                const refreshResponse = await axios.post(
                    `${BASE_URL}/auth/refreshToken`,
                    { refreshToken }
                );

                const { accessToken, refreshToken: newRefreshToken } =
                    refreshResponse.data.data;

                setTokens(accessToken, newRefreshToken);

                apiInstance.defaults.headers.common.Authorization =
                    `Bearer ${accessToken}`;

                processQueue(null, accessToken);

                originalRequest.headers.Authorization =
                    `Bearer ${accessToken}`;

                return apiInstance(originalRequest);
            } catch (err) {
                processQueue(err, null);
                clearTokens();
                window.location.replace("/login");
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiInstance;
