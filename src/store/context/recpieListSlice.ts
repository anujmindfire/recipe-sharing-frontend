import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecipeListProps, SearchParamsProps } from '../../interface/Interface';

const initialState: RecipeListProps = {
    recipes: [],
    totalPages: 0,
    page: 1,
    loading: false,
    allUniquePrepTimes: [],
    allUniqueCookTimes: [],
    errorMessage: '',
    showErrorModal: false,
    searchParams: {
        query: '',
        rating: '',
        prepTime: '',
        cookTime: '',
    },
    notFound: false,
};

const recipeSlice = createSlice({
    name: 'recipeList',
    initialState,
    reducers: {
        setRecipes: (state, action: PayloadAction<any[]>) => {
            state.recipes = action.payload;
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
        setUniquePrepTimes: (state, action: PayloadAction<string[]>) => {
            state.allUniquePrepTimes = action.payload;
        },
        setUniqueCookTimes: (state, action: PayloadAction<string[]>) => {
            state.allUniqueCookTimes = action.payload;
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
    },
});

export const {
    setRecipes,
    setTotalPages,
    setPage,
    setLoading,
    setUniquePrepTimes,
    setUniqueCookTimes,
    setErrorMessage,
    setShowErrorModal,
    setNotFound,
    setSearchParams,
} = recipeSlice.actions;

export default recipeSlice.reducer;
