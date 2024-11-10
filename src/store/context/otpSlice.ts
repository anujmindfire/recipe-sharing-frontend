import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OtpProps } from '../../interface/Interface';

const initialState: OtpProps = {
    otp: ['', '', '', '', '', ''],
    loading: false,
    errorMessage: '',
    showSnackbar: false,
    successMessage: '',
    isResendDisabled: true,
    resendTimer: 60,
    isInputDisabled: true
};

const otpVerifySlice = createSlice({
    name: 'otpVerify',
    initialState,
    reducers: {
        setOtp: (state, action: PayloadAction<string[]>) => {
            state.otp = action.payload;
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
        setResendTimer: (state, action: PayloadAction<number>) => {
            state.resendTimer = action.payload;
        },
        setResendDisabled: (state, action: PayloadAction<boolean>) => {
            state.isResendDisabled = action.payload;
        },
        setInputDisabled: (state, action: PayloadAction<boolean>) => {
            state.isInputDisabled = action.payload;
        }
    },
});

export const { setOtp, setLoading, setErrorMessage, setSuccessMessage, toggleSnackbar, setResendTimer, setResendDisabled, setInputDisabled } = otpVerifySlice.actions;

export default otpVerifySlice.reducer;