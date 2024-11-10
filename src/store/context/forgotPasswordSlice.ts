import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ForgotPasswordProps } from '../../interface/Interface';

const initialState: ForgotPasswordProps = {
    values: { email: '' },
    errors: { email: '' },
    loading: false,
    errorMessage: '',
    showSnackbar: false,
    successMessage: '',
};

const forgotPasswordSlice = createSlice({
    name: 'forgotPassword',
    initialState,
    reducers: {
        setField: (state, action: PayloadAction<{ name: any, value: string }>) => {
            const { name, value } = action.payload;
            state.values[name as keyof typeof state.values] = value;
        },
        setErrors: (state, action: PayloadAction<Partial<{ email: string }>>) => {
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
    },
});

export const { setField, setErrors, setLoading, setErrorMessage, setSuccessMessage, toggleSnackbar } = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;