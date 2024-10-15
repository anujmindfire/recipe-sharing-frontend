import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import styles from '../styles/Form.module.css';
import Input from '../components/Input';
import Button from '../components/Button';
import Validation from '../components/Validation';
import { backendURL } from '../api/url';
// import backgroundImage from './tomatoes-3681985_1280.jpg';

const regexPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,50}$/,
};

const initialState = {
    email: '',
    password: '',
    errors: { email: '', password: '' },
    loading: false,
    errorMessage: '',
};

const SignIn = () => {
    const [formData, setFormData] = useState(initialState);
    const navigate = useNavigate();

    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                return !regexPatterns.email.test(value) ? 'Please enter a valid email address.' : '';
            case 'password':
                return value.length === 0 ? 'Please enter a valid password.' : '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = DOMPurify.sanitize(value);
        setFormData((prev) => {
            const newErrors = { ...prev.errors, [name]: validateField(name, sanitizedValue) };
            return { ...prev, [name]: sanitizedValue, errors: newErrors };
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const errors = {
            email: validateField('email', formData.email),
            password: validateField('password', formData.password),
        };

        if (Object.values(errors).some(error => error)) {
            setFormData(prev => ({ ...prev, errors, errorMessage: '' }));
            return;
        }

        setFormData(prev => ({ ...prev, loading: true, errorMessage: '' }));

        try {
            const response = await fetch(`${backendURL}/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('accesstoken', data.accessToken);
                localStorage.setItem('refreshtoken', data.refreshToken);
                localStorage.setItem('id', data.data.userId);
                localStorage.setItem('name', data.data.name);
                navigate('/recipes');
            } else {
                setFormData(prev => ({ ...prev, errorMessage: data.message }));
            }
        } catch {
            setFormData(prev => ({ ...prev, errorMessage: 'Unable to connect to the server. Please check your internet connection.' }));
        } finally {
            setFormData(prev => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        if (localStorage.getItem('accesstoken') && localStorage.getItem('refreshtoken')) {
            navigate('/recipes');
        }
    }, [navigate]);

    return (
        <main className={styles.container}>
            <section className={styles.formWrapper}>
                <div className={styles.card}>
                    <form className={styles.formFields} onSubmit={onSubmit} noValidate>
                        <h2 className={styles.formTitle}>Welcome back</h2>

                        <Input
                            id='email'
                            type='email'
                            label='Email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            disabled={formData.loading}
                        />
                        <Validation error={formData.errors.email} show={!!formData.errors.email} />

                        <Input
                            id='password'
                            type='password'
                            label='Password'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            disabled={formData.loading}
                        />
                        <Validation error={formData.errors.password} show={!!formData.errors.password} />

                        <Button type='submit' loading={formData.loading} disabled={formData.loading}>Continue</Button>

                        <Validation error={formData.errorMessage} show={!!formData.errorMessage} />

                        <p className={styles.signInText}>
                            <a href='/forgot-password' className={styles.signInLink}>Forgot Password?</a>
                        </p>

                        <p className={styles.signInText}>
                            Don't have an account? <a href='/signup' className={styles.signInLink}>Sign up</a>
                        </p>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default SignIn;
