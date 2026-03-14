import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiInstance from "../api/ApiInstance";

// PUBLIC - Mesaj gönder
export const sendContactMessage = createAsyncThunk(
    "contact/send",
    async (messageData, { rejectWithValue }) => {
        try {
            const res = await apiInstance.post("/contact", messageData);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Mesaj gönderilemedi");
        }
    }
);

// ADMIN - Tüm mesajlar
export const fetchContactMessages = createAsyncThunk(
    "contact/admin/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get("/contact/admin");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Mesajlar getirilemedi");
        }
    }
);

// ADMIN - Okundu işaretle
// Backend void döndürüyor, sadece id kullanıyoruz
export const markMessageAsRead = createAsyncThunk(
    "contact/admin/markAsRead",
    async (id, { rejectWithValue }) => {
        try {
            await apiInstance.put(`/contact/admin/read/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "İşaretlenemedi");
        }
    }
);

// ADMIN - Mesaj sil
export const deleteContactMessage = createAsyncThunk(
    "contact/admin/delete",
    async (id, { rejectWithValue }) => {
        try {
            await apiInstance.delete(`/contact/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Mesaj silinemedi");
        }
    }
);

const contactSlice = createSlice({
    name: "contact",
    initialState: {
        messages: [],
        loading: false,
        error: null,
        sendStatus: null  // null | "loading" | "success" | "error"
    },
    reducers: {
        clearSendStatus: (state) => { state.sendStatus = null; },
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendContactMessage.pending, (state) => { state.sendStatus = "loading"; })
            .addCase(sendContactMessage.fulfilled, (state) => { state.sendStatus = "success"; })
            .addCase(sendContactMessage.rejected, (state, action) => {
                state.sendStatus = "error";
                state.error = action.payload;
            })
            .addCase(fetchContactMessages.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchContactMessages.fulfilled, (state, action) => {
                state.messages = action.payload;
                state.loading = false;
            })
            .addCase(fetchContactMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Backend void döndürdüğü için payload sadece id
            .addCase(markMessageAsRead.fulfilled, (state, action) => {
                const index = state.messages.findIndex(m => m.id === action.payload);
                if (index !== -1) state.messages[index] = { ...state.messages[index], read: true };
            })
            .addCase(deleteContactMessage.fulfilled, (state, action) => {
                state.messages = state.messages.filter(m => m.id !== action.payload);
            });
    }
});

export const { clearSendStatus, clearError } = contactSlice.actions;
export default contactSlice.reducer;