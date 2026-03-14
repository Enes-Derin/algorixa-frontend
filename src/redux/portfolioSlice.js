import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiInstance from "../api/ApiInstance";

// results/features/techStack gibi nested array'leri FormData'ya JSON string olarak ekle
const buildFormData = (projectData) => {
    const formData = new FormData();
    const { imageUrl, results, features, techStack, ...rest } = projectData;

    // Scalar field'lar
    Object.entries(rest).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            formData.append(key, value);
        }
    });

    // Nested list'ler — Spring @ModelAttribute bunları bind edemez,
    // JSON string olarak gönderiyoruz, backend'de manuel parse edilecek
    if (results) formData.append("resultsJson", JSON.stringify(results));
    if (features) formData.append("featuresJson", JSON.stringify(features));
    if (techStack) formData.append("techStackJson", JSON.stringify(techStack));

    // Görsel — sadece File gelirse ekle
    if (imageUrl instanceof File) {
        formData.append("imageUrl", imageUrl);
    }

    return formData;
};

export const fetchPublishedProjects = createAsyncThunk(
    "portfolio/fetchPublished",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get("/api/public/portfolio/projects");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Projeler getirilemedi");
        }
    }
);

export const fetchProjectsByCategory = createAsyncThunk(
    "portfolio/fetchByCategory",
    async (category, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get(`/api/public/portfolio/projects/category/${category}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Kategori projeleri getirilemedi");
        }
    }
);

export const fetchFeaturedProject = createAsyncThunk(
    "portfolio/fetchFeatured",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get("/api/public/portfolio/featured");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Öne çıkan proje getirilemedi");
        }
    }
);

export const fetchPortfolioCategories = createAsyncThunk(
    "portfolio/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get("/api/public/portfolio/categories");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Kategoriler getirilemedi");
        }
    }
);

export const fetchAllProjects = createAsyncThunk(
    "portfolio/admin/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiInstance.get("/api/admin/portfolio/projects");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Projeler getirilemedi");
        }
    }
);

export const createProject = createAsyncThunk(
    "portfolio/admin/create",
    async (projectData, { rejectWithValue }) => {
        try {
            const formData = buildFormData(projectData);
            const res = await apiInstance.post(
                "/api/admin/portfolio/projects",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Proje oluşturulamadı");
        }
    }
);

export const updateProject = createAsyncThunk(
    "portfolio/admin/update",
    async ({ id, projectData }, { rejectWithValue }) => {
        try {
            const formData = buildFormData(projectData);
            const res = await apiInstance.put(
                `/api/admin/portfolio/projects/${id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Proje güncellenemedi");
        }
    }
);

export const deleteProject = createAsyncThunk(
    "portfolio/admin/delete",
    async (id, { rejectWithValue }) => {
        try {
            await apiInstance.delete(`/api/admin/portfolio/projects/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Proje silinemedi");
        }
    }
);

export const toggleProjectFeatured = createAsyncThunk(
    "portfolio/admin/toggleFeatured",
    async (id, { rejectWithValue }) => {
        try {
            const res = await apiInstance.patch(`/api/admin/portfolio/projects/${id}/featured`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Öne çıkarma değiştirilemedi");
        }
    }
);

export const updateProjectDisplayOrder = createAsyncThunk(
    "portfolio/admin/updateOrder",
    async ({ id, order }, { rejectWithValue }) => {
        try {
            const res = await apiInstance.patch(`/api/admin/portfolio/projects/${id}/order?order=${order}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.errorMessage || "Sıra güncellenemedi");
        }
    }
);

const portfolioSlice = createSlice({
    name: "portfolio",
    initialState: {
        projects: [],
        featuredProject: null,
        categories: [],
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublishedProjects.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchPublishedProjects.fulfilled, (state, action) => { state.projects = action.payload; state.loading = false; })
            .addCase(fetchPublishedProjects.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchAllProjects.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllProjects.fulfilled, (state, action) => { state.projects = action.payload; state.loading = false; })
            .addCase(fetchAllProjects.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchFeaturedProject.fulfilled, (state, action) => { state.featuredProject = action.payload; })
            .addCase(fetchPortfolioCategories.fulfilled, (state, action) => { state.categories = action.payload; })
            .addCase(createProject.fulfilled, (state, action) => { state.projects.push(action.payload); })
            .addCase(updateProject.fulfilled, (state, action) => {
                const index = state.projects.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.projects[index] = action.payload;
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter(p => p.id !== action.payload);
            })
            .addCase(toggleProjectFeatured.fulfilled, (state, action) => {
                const index = state.projects.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.projects[index] = action.payload;
            })
            .addCase(updateProjectDisplayOrder.fulfilled, (state, action) => {
                const index = state.projects.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.projects[index] = action.payload;
            });
    }
});

export const { clearError } = portfolioSlice.actions;
export default portfolioSlice.reducer;