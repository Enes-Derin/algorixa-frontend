import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiInstance from "../api/ApiInstance";

// KULLANICI → MESAJ GÖNDER
export const sendMessage = createAsyncThunk(
    "contact/send",
    async (messageData) => {
        const res = await apiInstance.post("/contact", messageData);
        return res.data.data;
    }
);

// ADMIN → TÜM MESAJLARI LİSTELE
export const fetchContactMessages = createAsyncThunk(
    "contact/fetchAll",
    async () => {
        const res = await apiInstance.get("/contact/admin");
        return res.data.data;
    }
);

// ADMIN → MESAJ OKUNDU OLARAK İŞARETLE
export const markAsRead = createAsyncThunk(
    "contact/markAsRead",
    async (id) => {
        const res = await apiInstance.put(`/contact/admin/read/${id}`);
        // Backend'den yanıt gelmiş demektir
        return id;
    }
);

const contactSlice = createSlice({
    name: "contact",
    initialState: {
        messages: [],
        loading: false,
        error: null,
        sendStatus: null,
        markingAsReadId: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.fulfilled, (state) => {
                state.sendStatus = "success";
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.sendStatus = "error";
                state.error = action.error.message;
            })
            .addCase(fetchContactMessages.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchContactMessages.fulfilled, (state, action) => {
                // Backend'den gelen mesajları al
                let messages = action.payload;

                // Eğer markingAsReadId varsa (son işaretlenen mesaj), o mesajı force olarak read: true yap
                if (state.markingAsReadId) {
                    messages = messages.map(m =>
                        m.id === state.markingAsReadId ? { ...m, read: true } : m
                    );
                }

                state.messages = messages;
                state.loading = false;
            })
            .addCase(fetchContactMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(markAsRead.pending, (state, action) => {
                state.markingAsReadId = action.meta.arg;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const msg = state.messages.find(m => m.id === action.payload);
                if (msg) msg.read = true;
                state.markingAsReadId = null;
            })
            .addCase(markAsRead.rejected, (state, action) => {
                state.error = action.error.message;
                state.markingAsReadId = null;
            });
    }
});

export default contactSlice.reducer;
