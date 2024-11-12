import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditProfileProps } from '../../interface/Interface';

const initialState: EditProfileProps = {
    values: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        bio: '',
        favouriteRecipe: '',
    },
    errors: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    },
    loading: false,
    errorMessage: '',
    successMessage: '',
    showSnackbar: false,
};

const editProfileSlice = createSlice({
    name: 'editProfile',
    initialState,
    reducers: {
        setField: (state, action: PayloadAction<{ name: any, value: string }>) => {
            const { name, value } = action.payload;
            state.values[name as keyof typeof state.values] = value;
        },
        setErrors: (state, action: PayloadAction<Partial<typeof state.errors>>) => {
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
        }
    },
});

export const { 
    setField, 
    setErrors, 
    setLoading, 
    setErrorMessage, 
    setSuccessMessage, 
    toggleSnackbar, 
} = editProfileSlice.actions;

export default editProfileSlice.reducer;
