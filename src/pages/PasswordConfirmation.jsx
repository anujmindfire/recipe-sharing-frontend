import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import InputField from '../components/Input';
import Snackbar from '../components/Snackbar';
import Validation from '../components/Validation';
import Button from '../components/Button';
import styles from '../styles/Form.module.css';
import { backendURL } from '../api/url';

const PasswordConfirmation = () => {
    const { txnId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
        errors: {}
    });
    const [status, setStatus] = useState({
        loading: false,
        showSnackbar: false,
        successMessage: '',
        errorMessage: ''
    });

    const isValidPassword = (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,50}$/.test(password);

    const validateField = useCallback((name, value) => {
        if (name === 'password') {
            return isValidPassword(value) ? '' : 'Password must be 8-50 characters long, with at least one number, uppercase letter, lowercase letter, and special character.';
        }
        if (name === 'confirmPassword') {
            return value === formData.password ? '' : 'Passwords do not match.';
        }
        return '';
    }, [formData.password]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = DOMPurify.sanitize(value);

        setFormData((prev) => ({
            ...prev,
            [name]: sanitizedValue,
            errors: { ...prev.errors, [name]: validateField(name, sanitizedValue) }
        }));

        setStatus((prev) => ({ ...prev, errorMessage: '' }));
    };

    const validateForm = () => {
        const { password, confirmPassword } = formData;
        const errors = {
            password: validateField('password', password),
            confirmPassword: validateField('confirmPassword', confirmPassword),
        };

        setFormData((prev) => ({ ...prev, errors }));
        return !Object.values(errors).some((error) => error !== '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus((prev) => ({ ...prev, errorMessage: '' }));
        setStatus((prev) => ({ ...prev, loading: true }));

        if (!validateForm()) {
            setStatus((prev) => ({ ...prev, loading: false }));
            return;
        }

        try {
            const response = await fetch(`${backendURL}/password/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: formData.password, confirmPassword: formData.confirmPassword, txnId })
            });

            const data = await response.json();
            if (response.ok) {
                setStatus({
                    loading: false,
                    showSnackbar: true,
                    successMessage: data.message,
                    errorMessage: ''
                });
                localStorage.removeItem('email');
                localStorage.removeItem('txnId');
                setTimeout(() => navigate('/signin'), 2000);
            } else {
                handleErrorResponse(data);
            }
        } catch (error) {
            setStatus((prev) => ({
                ...prev,
                loading: false,
                errorMessage: 'Unable to connect to the server. Please check your internet connection.'
            }));
        }
    };

    const handleErrorResponse = (data) => {
        setStatus((prev) => ({
            ...prev,
            loading: false,
            errorMessage: data.message
        }));
        if (data.message === 'Link has expired') {
            setTimeout(() => navigate('/forgot-password'), 1000);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem('email') && !localStorage.getItem('txnId')) {
            navigate('/forgot-password');
        }
    }, [navigate]);

    useEffect(() => {
        const handleUnload = () => localStorage.setItem('isLeavingPasswordPage', 1);
        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, []);

    useEffect(() => {
        let matchTxnId = txnId === localStorage.getItem('txnId');
        if (!matchTxnId) {
            navigate('/forgot-password');
        }
        if (Number(localStorage.getItem('isLeavingPasswordPage')) === 1 && matchTxnId) {
            localStorage.setItem('isLeavingPasswordPage', 2);
            navigate('/forgot-password');
        } else if (Number(localStorage.getItem('isLeavingPasswordPage')) === 2 && matchTxnId) {
            localStorage.removeItem('isLeavingPasswordPage');
        }
    }, [navigate, txnId]);

    return (
        <main className={styles.container}>
            <section className={styles.formWrapper}>
                <div className={styles.card}>
                    <form className={styles.formFields} onSubmit={handleSubmit} noValidate>
                        <h2 className={styles.formTitle}>Reset your password</h2>

                        <InputField
                            label='Password'
                            name='password'
                            type='password'
                            value={formData.password}
                            onChange={handleChange}
                            error={formData.errors.password}
                            disabled={status.loading}
                        />

                        <Validation error={formData.errors.password} show={!!formData.errors.password} />

                        <InputField
                            label='Confirm Password'
                            name='confirmPassword'
                            type='password'
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={formData.errors.confirmPassword}
                            disabled={status.loading}
                        />

                        <Validation error={formData.errors.confirmPassword} show={!!formData.errors.confirmPassword} />

                        <Button type='submit' loading={status.loading} disabled={status.loading}>
                            Reset Password
                        </Button>

                        <Validation error={status.errorMessage} show={!!status.errorMessage} />
                    </form>
                </div>
            </section>

            <Snackbar
                message={status.successMessage}
                isVisible={status.showSnackbar}
                onClose={() => setStatus((prev) => ({ ...prev, showSnackbar: false }))}
            />
        </main>
    );
};

export default PasswordConfirmation;
