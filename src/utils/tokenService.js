// Token yönetimi - localStorage ile
const TOKEN_EXPIRY_KEY = "tokenExpiry";
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const REFRESH_THRESHOLD = 2 * 60 * 1000; // 2 dakika önce yenile

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    // Token expiry'ı ayarla (15 dakika sonra)
    const expiryTime = new Date().getTime() + (15 * 60 * 1000);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime);
};

export const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

export const isTokenExpired = () => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;
    return new Date().getTime() > parseInt(expiry);
};

export const shouldRefreshToken = () => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;
    const currentTime = new Date().getTime();
    const expiryTime = parseInt(expiry);
    return currentTime > (expiryTime - REFRESH_THRESHOLD);
};