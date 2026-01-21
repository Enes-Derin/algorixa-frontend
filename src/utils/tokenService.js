import { store } from "../redux/store";
import { setAccessToken, clearExpiredToken, logout } from "../redux/authSlice";

const TOKEN_EXPIRY_KEY = "tokenExpiry";
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const REFRESH_THRESHOLD = 2 * 60 * 1000; // Token 2 dk. önce yenilenir

const tokenService = {
    isTokenExpired: () => {
        const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
        if (!expiry) return true;
        return new Date().getTime() > parseInt(expiry);
    },

    shouldRefreshToken: () => {
        const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
        if (!expiry) return true;
        return new Date().getTime() > parseInt(expiry) - REFRESH_THRESHOLD;
    },

    clearExpiredTokenFromStorage: () => {
        if (tokenService.isTokenExpired()) {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(TOKEN_EXPIRY_KEY);
            store.dispatch(clearExpiredToken());
            return true;
        }
        return false;
    },

    clearAllTokens: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem("role");
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
        store.dispatch(logout());
    },

    getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),

    updateTokens: (accessToken, refreshToken) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

        const expiryTime = new Date().getTime() + 15 * 60 * 1000; // 15 dk
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime);

        store.dispatch(setAccessToken({ accessToken, refreshToken }));
    }
};

export default tokenService;
