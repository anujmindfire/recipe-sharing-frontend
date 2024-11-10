import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PasswordConfirmationProps } from '../../interface/Interface';

const initialState: PasswordConfirmationProps = {
    values: { password: '', confirmPassword: '' },
    errors: { password: '', confirmPassword: '' },
    loading: false,
    errorMessage: '',
    showSnackbar: false,
    successMessage: '',
};

const passwordConfirmationSlice = createSlice({
    name: 'passwordConfirmation',
    initialState,
    reducers: {
        setField: (state, action: PayloadAction<{ name: any, value: string }>) => {
            const { name, value } = action.payload;
            state.values[name as keyof typeof state.values] = value;
        },
        setErrors: (state, action: PayloadAction<Partial<{ password: string, confirmPassword: string }>>) => {
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

export const { setField, setErrors, setLoading, setErrorMessage, setSuccessMessage, toggleSnackbar } = passwordConfirmationSlice.actions;

export default passwordConfirmationSlice.reducer;
