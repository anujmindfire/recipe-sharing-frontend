import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SignUpProps } from '../../types/types';

const initialState: SignUpProps = {
    values: { name: '', email: '', password: '' },
    errors: { name: '', email: '', password: '' },
    loading: false,
    errorMessage: '',
};

const signUpSlice = createSlice({
    name: 'signUp',
    initialState,
    reducers: {
        setField: (state, action: PayloadAction<{ name: any, value: string }>) => {
            const { name, value } = action.payload;
            state.values[name as keyof typeof state.values] = value;
        },
        setErrors: (state, action: PayloadAction<Partial<{ name: string, email: string, password: string }>>) => {
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

export const { setField, setErrors, setLoading, setErrorMessage } = signUpSlice.actions;

export default signUpSlice.reducer;