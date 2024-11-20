import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AddRecipeProps } from '../../types/types';

const initialState: AddRecipeProps = {
    values: {
        recipeTitle: '',
        ingredients: '',
        preparationSteps: '',
        description: '',
        preparationTime: '',
        cookingTime: '',
        imageUrl: '',
    },
    errors: {
        recipeTitle: '',
        ingredients: '',
        preparationSteps: '',
        preparationTime: '',
        cookingTime: '',
        imageUrl: '',
    },
    loading: false,
    errorMessage: '',
    successMessage: '',
    showSnackbar: false,
    imageUploadSuccess: false,
};

const addRecipeSlice = createSlice({
    name: 'addRecipe',
    initialState,
    reducers: {
        setField: (state, action: PayloadAction<{ name: string, value: string }>) => {
            const { name, value } = action.payload;
            state.values[name as keyof typeof state.values] = value;
        },
        setErrors: (state, action: PayloadAction<Partial<{ 
            recipeTitle: string, 
            ingredients: string, 
            preparationSteps: string, 
            preparationTime: string,
            cookingTime: string,
            imageUrl: string
        }>>) => {
            state.errors = { ...state.errors, ...action.payload };
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setErrorMessage: (state, action: PayloadAction<string>) => {
            state.errorMessage = action.payload;
        },
        setSuccessMessage: (state, action: PayloadAction<string>) => {
            state.successMessage = action.payload;
        },
        toggleSnackbar: (state, action: PayloadAction<boolean>) => {
            state.showSnackbar = action.payload;
        },
        setImageUploadSuccess: (state, action: PayloadAction<boolean>) => {
            state.imageUploadSuccess = action.payload;
        },
    },
});

export const {
    setField,
    setErrors,
    setLoading,
    setErrorMessage,
    setSuccessMessage,
    toggleSnackbar,
    setImageUploadSuccess,
} = addRecipeSlice.actions;

export default addRecipeSlice.reducer;
