import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileListProps, SearchParamsProps } from '../../types/types';

const initialState: ProfileListProps = {
    profiles: [],
    totalPages: 0,
    page: 1,
    loading: false,
    errorMessage: '',
    showErrorModal: false,
    searchParams: {
        query: ''
    },
    notFound: false,
    showSnackbar: false,
    successMessage: '',
};

const profileListSlice = createSlice({
    name: 'profileList',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<any[]>) => {
            state.profiles = action.payload;
        },
        setTotalPages: (state, action: PayloadAction<number>) => {
            state.totalPages = action.payload;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setErrorMessage: (state, action: PayloadAction<string>) => {
            state.errorMessage = action.payload;
        },
        setShowErrorModal: (state, action: PayloadAction<boolean>) => {
            state.showErrorModal = action.payload;
        },
        setNotFound: (state, action: PayloadAction<boolean>) => {
            state.notFound = action.payload;
        },
        setSearchParams: (state, action: PayloadAction<Partial<SearchParamsProps>>) => {
            state.searchParams = { ...state.searchParams, ...action.payload };
        },
        setSuccessMessage: (state, action: PayloadAction<string>) => {
            state.successMessage = action.payload;
        },
        toggleSnackbar: (state, action: PayloadAction<boolean>) => {
            state.showSnackbar = action.payload;
        },
    },
});

export const {
    setProfile,
    setTotalPages,
    setPage,
    setLoading,
    setErrorMessage,
    setShowErrorModal,
    setNotFound,
    setSearchParams,
    setSuccessMessage,
    toggleSnackbar
} = profileListSlice.actions;

export default profileListSlice.reducer;
