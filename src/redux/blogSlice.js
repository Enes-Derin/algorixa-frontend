import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiInstance from "../api/ApiInstance";

// "2024-01-15T00:00:00" → "2024-01-15" dönüşümü
const formatDate = (val) => {
    if (!val) return null;
    if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    return new Date(val).toISOString().split("T")[0];
};

export const fetchPublishedPosts = createAsyncThunk(
    "blog/fetchPublished",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get("/api/public/blog/posts");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Yazılar getirilemedi");
        }
    }
);

export const fetchPostsByCategory = createAsyncThunk(
    "blog/fetchByCategory",
    async (category, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get(`/api/public/blog/posts/category/${category}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Kategori yazıları getirilemedi");
        }
    }
);

export const fetchPostBySlug = createAsyncThunk(
    "blog/fetchBySlug",
    async (slug, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get(`/api/public/blog/posts/${slug}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Yazı bulunamadı");
        }
    }
);

export const fetchFeaturedPosts = createAsyncThunk(
    "blog/fetchFeatured",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get("/api/public/blog/featured");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Öne çıkan yazılar getirilemedi");
        }
    }
);

export const incrementViewCount = createAsyncThunk(
    "blog/incrementView",
    async (id, { rejectWithValue }) => {
        try {
            await apiInstance.post(`/api/public/blog/posts/${id}/view`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Görüntülenme artırılamadı");
        }
    }
);

export const fetchCategories = createAsyncThunk(
    "blog/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get("/api/public/blog/categories");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Kategoriler getirilemedi");
        }
    }
);

export const fetchAllPosts = createAsyncThunk(
    "blog/admin/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get("/api/admin/blog/posts");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Yazılar getirilemedi");
        }
    }
);

export const createPost = createAsyncThunk(
    "blog/admin/create",
    async (postData, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            // imageUrl bir File objesiyse FormData'ya ekle, değilse atlat
            const { imageUrl, ...rest } = postData;

            // Diğer tüm alanları ekle
            Object.entries(rest).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            // publishedDate formatla
            if (rest.publishedDate) {
                formData.set("publishedDate", formatDate(rest.publishedDate));
            }

            // Görsel varsa ekle
            if (imageUrl instanceof File) {
                formData.append("imageUrl", imageUrl);
            }

            const res = await apiInstance.post(
                "/api/admin/blog/posts",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Yazı oluşturulamadı");
        }
    }
);

export const updatePost = createAsyncThunk(
    "blog/admin/update",
    async ({ id, postData }, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            const { imageUrl, ...rest } = postData;

            Object.entries(rest).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            if (rest.publishedDate) {
                formData.set("publishedDate", formatDate(rest.publishedDate));
            }

            if (imageUrl instanceof File) {
                formData.append("imageUrl", imageUrl);
            }
            // imageUrl File değilse (null veya string URL) gönderme — backend mevcut görseli korur

            const res = await apiInstance.put(
                `/api/admin/blog/posts/${id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Yazı güncellenemedi");
        }
    }
);

export const deletePost = createAsyncThunk(
    "blog/admin/delete",
    async (id, { rejectWithValue }) => {
        try {
            await apiInstance.delete(`/api/admin/blog/posts/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Yazı silinemedi");
        }
    }
);

export const updatePostStatus = createAsyncThunk(
    "blog/admin/updateStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const res = await apiInstance.patch(`/api/admin/blog/posts/${id}/status?status=${status}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Durum güncellenemedi");
        }
    }
);

export const toggleFeatured = createAsyncThunk(
    "blog/admin/toggleFeatured",
    async (id, { rejectWithValue }) => {
        try {
            const res = await apiInstance.patch(`/api/admin/blog/posts/${id}/featured`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Öne çıkarma değiştirilemedi");
        }
    }
);

const blogSlice = createSlice({
    name: "blog",
    initialState: {
        posts: [],
        currentPost: null,
        featuredPosts: [],
        categories: [],
        loading: false,
        error: null
    },
    reducers: {
        clearCurrentPost: (state) => { state.currentPost = null; },
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublishedPosts.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPublishedPosts.fulfilled, (state, action) => { state.posts = action.payload; state.loading = false; })
            .addCase(fetchPublishedPosts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchAllPosts.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllPosts.fulfilled, (state, action) => { state.posts = action.payload; state.loading = false; })
            .addCase(fetchAllPosts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchPostBySlug.fulfilled, (state, action) => { state.currentPost = action.payload; })
            .addCase(fetchFeaturedPosts.fulfilled, (state, action) => { state.featuredPosts = action.payload; })
            .addCase(fetchCategories.fulfilled, (state, action) => { state.categories = action.payload; })
            .addCase(createPost.fulfilled, (state, action) => { state.posts.unshift(action.payload); })
            .addCase(updatePost.fulfilled, (state, action) => {
                const index = state.posts.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.posts[index] = action.payload;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.posts = state.posts.filter(p => p.id !== action.payload);
            })
            .addCase(updatePostStatus.fulfilled, (state, action) => {
                const index = state.posts.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.posts[index] = action.payload;
            })
            .addCase(toggleFeatured.fulfilled, (state, action) => {
                const index = state.posts.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.posts[index] = action.payload;
            });
    }
});

export const { clearCurrentPost, clearError } = blogSlice.actions;
export default blogSlice.reducer;