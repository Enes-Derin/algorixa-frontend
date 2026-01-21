// Token yönetimi ve otomatik refresh işlemleri
import { store } from "../redux/store";
import { setAccessToken, clearExpiredToken, logout } from "../redux/authSlice";

const TOKEN_EXPIRY_KEY = "tokenExpiry";
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const REFRESH_THRESHOLD = 2 * 60 * 1000; // Token süresi dolmadan 2 dakika önce yenile

export const tokenService = {
    // Token süresi bitmiş mi kontrol et
    isTokenExpired: () => {
        const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
        if (!expiry) return true;
        return new Date().getTime() > parseInt(expiry);
    },

    // Token çok yakında bitecek mi kontrol et (2 dakika önce)
    shouldRefreshToken: () => {
        const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
        if (!expiry) return true;
        const currentTime = new Date().getTime();
        const expiryTime = parseInt(expiry);
        return currentTime > (expiryTime - REFRESH_THRESHOLD);
    },

    // Süresi dolan token'ı temizle
    clearExpiredTokenFromStorage: () => {
        if (tokenService.isTokenExpired()) {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(TOKEN_EXPIRY_KEY);
            store.dispatch(clearExpiredToken());
            return true;
        }
        return false;
    },

    // Tüm token'ları temizle (logout)
    clearAllTokens: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem("role");
        localStorage.removeItem(TOKEN_EXPIRY_KEY);
        store.dispatch(logout());
    },

    // Access token'ı al
    getAccessToken: () => {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    // Refresh token'ı al
    getRefreshToken: () => {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    // Token'ları yeni token'larla güncelle
    updateTokens: (accessToken, refreshToken) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        
        // Yeni expiry zamanı (15 dakika)
        const expiryTime = new Date().getTime() + (15 * 60 * 1000);
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime);
        
        // Redux state'i güncelle
        store.dispatch(setAccessToken({
            accessToken,
            refreshToken
        }));
    }
};

export default tokenService;
