import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/redux/store';
import constant, { buttonType } from '../utils/constant';
import { setOtp, setLoading, setErrorMessage, setSuccessMessage, toggleSnackbar, setResendTimer, setResendDisabled, setInputDisabled } from '../store/context/otpSlice';
import { apiService } from '../apiService/service';
import Button from '../components/Button';
import Snackbar from '../components/Snackbar';
import Validation from '../components/Validation';
import ErrorBoundary from '../components/ErrorBoundary';

const OTPVerify = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const formData = useSelector((state: RootState) => state.otpVerify);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!constant.localStorageUtils.getItem(constant.localStorageKeys.email)
            && !constant.localStorageUtils.getItem(constant.localStorageKeys.txnId)) {
            router.push(constant.routes.signIn);
        }
        const isLeaving = Number(localStorage.getItem(constant.localStorageKeys.isLeavingOTPPage));
        if (isLeaving === Number(constant.localStorageKeys.isLeavingOTPPageValue)) {
            localStorage.setItem(constant.localStorageKeys.isLeavingOTPPage, constant.localStorageKeys.isLeavingOTPPageValue2);
            router.push(constant.routes.signUp);
        } else if (isLeaving === Number(constant.localStorageKeys.isLeavingOTPPageValue2)) {
            localStorage.removeItem(constant.localStorageKeys.isLeavingOTPPage);
        }
    }, [router]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (formData.isResendDisabled && formData.resendTimer > 0) {
            interval = setInterval(() => {
                dispatch(setResendTimer(formData.resendTimer - 1));
            }, 1000);
        }

        if (formData.resendTimer === 0) {
            dispatch(setResendDisabled(false));
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [formData.resendTimer, formData.isResendDisabled, dispatch]);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...formData.otp];
        newOtp[index] = value;
        dispatch(setOtp(newOtp));

        if (value && index < formData.otp.length - 1) {
            otpRefs.current[index + 1]?.focus();
        } else if (!value && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && formData.otp[index] === '' && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleInputChange = (e: React.FormEvent<HTMLInputElement>, index: number) => {
        const value = (e.target as HTMLInputElement).value;
        if (/^\d*$/.test(value)) {
            handleOtpChange(value, index);
        }
    };

    const validateOtp = () => {
        return formData.otp.join('').length !== 6 ? constant.label.otpValidation : '';
    };

    const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationError = validateOtp();
        if (validationError) {
            dispatch(setErrorMessage(validationError));
            return;
        }

        dispatch(setLoading(true));
        dispatch(setErrorMessage(''));

        const payload = {
            otp: formData.otp.join(''),
            txnId: localStorage.getItem(constant.localStorageKeys.txnId)
        }

        const result = await apiService(payload, constant.apiLabel.otpVerify);
        if (result.success) {
            dispatch(setSuccessMessage(result.data.message));
            dispatch(toggleSnackbar(true));
            localStorage.removeItem(constant.localStorageKeys.email);
            localStorage.removeItem(constant.localStorageKeys.txnId);
            setTimeout(() => router.push(constant.routes.signIn), 2000);
        } else {
            dispatch(setErrorMessage(result.message));
        }

        dispatch(setLoading(false));
    };

    const handleResendOtp = async () => {
        dispatch(setLoading(true));
        dispatch(setErrorMessage(''));

        const payload = {
            txnId: localStorage.getItem(constant.localStorageKeys.txnId)
        }

        const result = await apiService(payload, constant.apiLabel.otpResend);
        if (result.success) {
            dispatch(setSuccessMessage(result.data.message));
            dispatch(toggleSnackbar(true));
            dispatch(setResendDisabled(true));
            dispatch(setResendTimer(60));
        } else {
            dispatch(setErrorMessage(result.message));
            setTimeout(() => router.push(constant.routes.signUp), 1000);
        }
        dispatch(setLoading(false));
    };

    return (
        <ErrorBoundary>
            <main className='flex min-h-screen w-full items-center justify-center bg-gray-800 text-gray-400 p-5 font-sans bg-cover bg-center' style={{ backgroundImage: 'url(https://img.freepik.com/free-photo/olive-oil-cherry-tomato-with-raw-italian-pasta-black-backdrop_23-2148195021.jpg?size=626&ext=jpg&ga=GA1.1.1191947113.1728852957&semt=ais_hybrid)' }}>
                <section className='flex w-full max-w-3xl px-5 flex-col items-center justify-center'>
                    <div className='bg-gray-900 rounded-lg p-8 shadow-md max-w-md w-full mx-auto text-gray-200'>
                        <form className='flex flex-col gap-4' onSubmit={handleVerifyOtp} noValidate>
                            <h2 className='mb-6 text-center text-white font-semibold'>{constant.label.enterOtp}</h2>
                            <div className='flex gap-2'>
                                {formData.otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type={constant.inputLabel.name.type}
                                        className='w-full h-12 text-center text-lg rounded-md border-none bg-gray-800 text-gray-200 focus:outline-none focus:bg-indigo-200'
                                        maxLength={1}
                                        value={digit}
                                        onInput={(event) => handleInputChange(event, index)}
                                        ref={(el) => { otpRefs.current[index] = el; }}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        aria-label={`${constant.label.otpDigit} ${index + 1}`}
                                        disabled={formData.loading}
                                    />
                                ))}
                            </div>

                            <Validation error={formData.errorMessage} show={!!formData.errorMessage} />

                            <Button type={buttonType.submit} loading={formData.loading}>
                                {constant.label.verify}
                            </Button>

                            <p className='mt-5 text-center text-sm'>
                                {formData.isResendDisabled ? (
                                    <>
                                        <span> {constant.label.resendCodeIn} </span>
                                        <span> {formData.resendTimer} </span>
                                        <span> {constant.label.second} </span>
                                    </>
                                ) : (
                                    <>
                                        <span>{constant.label.havingCode}</span>
                                        <button
                                            className='text-blue-500 font-bold hover:underline'
                                            type='button'
                                            onClick={handleResendOtp}
                                        >
                                            {constant.label.resendCode}
                                        </button>
                                    </>
                                )}
                            </p>
                            <hr className='my-5 border-t border-gray-600' />
                            <button
                                type='button'
                                className='mt-4 text-blue-500 text-sm font-semibold hover:underline'
                                onClick={() => router.push(constant.routes.signUp)}
                            >
                                {constant.label.changeEmail}
                            </button>
                        </form>
                    </div>
                </section>
                <Snackbar
                    message={formData.successMessage}
                    isVisible={formData.showSnackbar}
                    onClose={() => dispatch(toggleSnackbar(false))}
                />
            </main>
        </ErrorBoundary>
    );
};

export default OTPVerify;
