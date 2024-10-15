import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import styles from '../styles/Form.module.css';
import InputField from '../components/Input';
import Button from '../components/Button';
import Snackbar from '../components/Snackbar';
import Validation from '../components/Validation';
import { backendURL } from '../api/url';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({ email: '' });
    const [status, setStatus] = useState({
        showSnackbar: false,
        successMessage: '',
        loading: false,
        errorMessage: ''
    });
    const navigate = useNavigate();

    const validateEmail = useCallback(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: DOMPurify.sanitize(value)
        }));
        setStatus(prev => ({ ...prev, errorMessage: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(prev => ({ ...prev, loading: true, errorMessage: '' }));

        if (!formData.email.trim()) {
            return setStatus(prev => ({ ...prev, loading: false, errorMessage: 'Email is required.' }));
        }

        if (!validateEmail(formData.email)) {
            return setStatus(prev => ({ ...prev, loading: false, errorMessage: 'Please enter a valid email address.' }));
        }

        try {
            const response = await fetch(`${backendURL}/password/sendEmail`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            const successMessage = response.ok ? data.message : data.message;

            setStatus(prev => ({
                ...prev,
                loading: false,
                errorMessage: response.ok ? '' : successMessage,
                showSnackbar: response.ok,
                successMessage: response.ok ? successMessage : ''
            }));

            if (response.ok) {
                localStorage.setItem('txnId', data.data.txnId);
                localStorage.setItem('email', true);
                setTimeout(() => navigate('/signin'), 2000);
            }
        } catch {
            setStatus(prev => ({
                ...prev,
                loading: false,
                errorMessage: 'Unable to connect to the server. Please check your internet connection.'
            }));
        }
    };

    useEffect(() => {
        if (localStorage.getItem('accesstoken') && localStorage.getItem('refreshtoken')) {
            navigate('/recipes');
        }
    }, [navigate]);

    useEffect(() => {
        localStorage.removeItem('email');
        localStorage.removeItem('txnId');
    }, []);

    return (
        <main className={styles.container}>
            <section className={styles.formWrapper}>
                <div className={styles.card}>
                    <form className={styles.formFields} onSubmit={handleSubmit} noValidate>
                        <h2 className={styles.formTitle}>Reset your password</h2>

                        <InputField
                            label='Email'
                            name='email'
                            type='email'
                            value={formData.email}
                            onChange={handleChange}
                            disabled={status.loading}
                        />

                        <Validation error={status.errorMessage} show={!!status.errorMessage} />

                        <p className={styles.prompt}>
                            Remembered your password? <a href='/signin' className={styles.signInLink}>Sign in</a>
                        </p>

                        <Button type='submit' loading={status.loading} disabled={status.loading}> 
                            {status.loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
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

export default ForgotPassword;
