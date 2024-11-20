import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SignInProps } from '../../types/types';

const initialState: SignInProps = {
    values: { email: '', password: '' },
    errors: { email: '', password: '' },
    loading: false,
    errorMessage: '',
};

const signInSlice = createSlice({
    name: 'signIn',
    initialState,
    reducers: {
        setField: (state, action: PayloadAction<{ name: any, value: string }>) => {
            const { name, value } = action.payload;
            state.values[name as keyof typeof state.values] = value;
        },
        setErrors: (state, action: PayloadAction<Partial<{ email: string, password: string }>>) => {
            state.errors = { ...state.errors, ...action.payload };
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setErrorMessage: (state, action: PayloadAction<string>) => {
            state.errorMessage = action.payload;
        },
    },
});

export const { setField, setErrors, setLoading, setErrorMessage } = signInSlice.actions;

export default signInSlice.reducer;