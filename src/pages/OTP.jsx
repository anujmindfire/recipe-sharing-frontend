import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/OTP.module.css';
import Snackbar from '../components/Snackbar';
import Button from '../components/Button';
import Validation from '../components/Validation';
import { backendURL } from '../api/url';

const OTP = () => {
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [status, setStatus] = useState({
        showSnackbar: false,
        successMessage: '',
        loading: false,
        errorMessage: '',
        resendTimer: 60,
        isResendDisabled: true,
    });
    const [isInputDisabled, setInputDisabled] = useState(false);

    const navigate = useNavigate();
    const otpRefs = useRef(otp.map(() => React.createRef()));

    useEffect(() => {
        if (!localStorage.getItem('email') || !localStorage.getItem('txnId')) {
            navigate('/signup');
        }

        const isLeaving = Number(localStorage.getItem('isLeavingOTPPage'));
        if (isLeaving === 1) {
            localStorage.setItem('isLeavingOTPPage', 2);
            navigate('/signup');
        } else if (isLeaving === 2) {
            localStorage.removeItem('isLeavingOTPPage');
        }
    }, [navigate]);

    useEffect(() => {
        const handleUnload = () => localStorage.setItem('isLeavingOTPPage', 1);
        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, []);

    useEffect(() => {
        let interval = null;
        if (status.isResendDisabled && status.resendTimer > 0) {
            interval = setInterval(() => {
                setStatus(prev => ({ ...prev, resendTimer: prev.resendTimer - 1 }));
            }, 1000);
        }

        if (status.resendTimer === 0) {
            setStatus(prev => ({ ...prev, isResendDisabled: false }));
        }

        return () => clearInterval(interval);
    }, [status.resendTimer, status.isResendDisabled]);

    const handleOtpChange = (value, index) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            otpRefs.current[index + 1].current.focus();
        } else if (!value && index > 0) {
            otpRefs.current[index - 1].current.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            otpRefs.current[index - 1].current.focus();
        }
    };

    const handleInputChange = (e, index) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            handleOtpChange(value, index);
        }
    };

    const validateOtp = () => {
        return otp.join('').length !== 6 ? 'Please enter all 6 digits.' : '';
    };

    const handleApiResponse = async (url, body) => {
        setStatus(prev => ({ ...prev, loading: true, errorMessage: '' }));
        setInputDisabled(true);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            return { ok: response.ok, message: data.message };
        } catch {
            return { ok: false, message: 'Unable to connect to the server. Please check your internet connection.' };
        } finally {
            setStatus(prev => ({ ...prev, loading: false }));
            setInputDisabled(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const transactionId = localStorage.getItem('txnId');
        const validationError = validateOtp();

        if (validationError) {
            setStatus(prev => ({ ...prev, errorMessage: validationError }));
            return;
        }

        const { ok, message } = await handleApiResponse(`${backendURL}/verify`, { otp: otp.join(''), txnId: transactionId });

        if (ok) {
            setStatus(prev => ({ ...prev, successMessage: message, showSnackbar: true }));
            setTimeout(() => {
                localStorage.removeItem('txnId');
                localStorage.removeItem('email');
                navigate('/signin');
            }, 1000);
        } else {
            setStatus(prev => ({ ...prev, errorMessage: message }));
        }
    };

    const handleResendOtp = async () => {
        const transactionId = localStorage.getItem('txnId');
        const { ok, message } = await handleApiResponse(`${backendURL}/resend`, { txnId: transactionId });

        if (ok) {
            setStatus(prev => ({ ...prev, successMessage: message, showSnackbar: true, isResendDisabled: true, resendTimer: 60 }));
        } else {
            setStatus(prev => ({ ...prev, errorMessage: message }));
            setTimeout(() => navigate('/signup'), 1000);
        }
    };

    return (
        <main className={styles.container}>
            <section className={styles.formWrapper}>
                <div className={styles.card}>
                    <form className={styles.formFields} onSubmit={handleVerifyOtp} noValidate>
                        <h2 className={styles.formTitle}>Enter OTP</h2>
                        <div className={styles.inputContainer}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type='text'
                                    className={styles.input}
                                    maxLength={1}
                                    value={digit}
                                    onInput={(event) => handleInputChange(event, index)}
                                    ref={otpRefs.current[index]}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    aria-label={`OTP digit ${index + 1}`}
                                    disabled={isInputDisabled}
                                />
                            ))}
                        </div>
                        <Validation error={status.errorMessage} show={!!status.errorMessage} />
                        <Button type='submit' loading={status.loading} disabled={status.loading}>
                            {status.loading ? 'Verifying...' : 'Verify'}
                        </Button>
                        <p className={styles.resendText}>
                            {status.isResendDisabled ? (
                                <>
                                    <span>Resend code in </span>
                                    <span>{status.resendTimer}</span>
                                    <span> seconds.</span>
                                </>
                            ) : (
                                <>
                                    <span>Having trouble receiving the code? </span>
                                    <button className={styles.resendButton} type='button' onClick={handleResendOtp}>
                                        <span>Resend Code</span>
                                    </button>
                                </>
                            )}
                        </p>
                        <hr className={styles.separator} />
                        <button type='button' className={styles.goBackButton} onClick={() => navigate('/signup')}>
                            Go Back to Change Your Email
                        </button>
                    </form>
                </div>
            </section>
            <Snackbar
                message={status.successMessage}
                isVisible={status.showSnackbar}
                onClose={() => setStatus(prev => ({ ...prev, showSnackbar: false }))}
            />
        </main>
    );
};

export default OTP;
