import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiInstance from "../api/ApiInstance";

export const fetchProjects = createAsyncThunk(
    "project/fetchAll",
    async () => {
        const res = await apiInstance.get("/project/all");
        return res.data.data;
    }
);

export const createProject = createAsyncThunk(
    "project/create",
    async (formData) => {
        const res = await apiInstance.post(
            "/project/admin",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return res.data.data;
    }
);

export const updateProject = createAsyncThunk(
    "project/update",
    async ({ id, formData }) => {
        const res = await apiInstance.put(
            `/project/admin/${id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return res.data.data;
    }
);

export const deleteProject = createAsyncThunk(
    "project/delete",
    async (id) => {
        await apiInstance.delete(`/project/admin/${id}`);
        return id;
    }
);

const projectSlice = createSlice({
    name: "project",
    initialState: {
        projects: [],
        loading: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.projects = action.payload;
                state.loading = false;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.projects.push(action.payload);
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                const index = state.projects.findIndex(
                    p => p.id === action.payload.id
                );
                if (index !== -1) {
                    state.projects[index] = action.payload;
                }
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.projects = state.projects.filter(
                    p => p.id !== action.payload
                );
            });
    }
});

export default projectSlice.reducer;
