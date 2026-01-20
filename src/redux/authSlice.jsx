import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: sessionStorage.getItem("accessToken") || null,
    role: sessionStorage.getItem("role") || null,
    isAuthenticated: !!sessionStorage.getItem("accessToken")
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Backend'den login response'ı
        loginSuccess: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.role = action.payload.role;
            state.isAuthenticated = true;

            // sessionStorage'a kaydet (page refresh olsa bile kalır)
            sessionStorage.setItem("accessToken", action.payload.accessToken);
            sessionStorage.setItem("role", action.payload.role);
            // refreshToken HTTP-only cookie'de kalıyor (server tarafından yönetilir)
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
            state.isAuthenticated = true;
            sessionStorage.setItem("accessToken", action.payload);
        },
        logout: (state) => {
            state.accessToken = null;
            state.role = null;
            state.isAuthenticated = false;

            // sessionStorage'dan temizle
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("role");
        }
    }
});

export const {
    loginSuccess,
    setAccessToken,
    logout
} = authSlice.actions;

export default authSlice.reducer;
