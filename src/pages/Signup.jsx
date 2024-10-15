import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import styles from '../styles/Form.module.css';
import Input from '../components/Input';
import Button from '../components/Button';
import Validation from '../components/Validation';
import { backendURL } from '../api/url';

const regexPatterns = {
    name: /^[A-Za-z\s]+$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,50}$/,
};

const initialState = {
    name: '',
    email: '',
    password: '',
    errors: { name: '', email: '', password: '' },
    loading: false,
    errorMessage: '',
};

const SignUp = () => {
    const [formData, setFormData] = useState(initialState);
    const navigate = useNavigate();

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                return !regexPatterns.name.test(value) ? 'Name can only contain letters and spaces.' : 
                       (value.length < 2 || value.length > 50) ? 'Name should be greater than 2 and less than 50 characters.' : '';
            case 'email':
                return !regexPatterns.email.test(value) ? 'Please enter a valid email address.' : '';
            case 'password':
                return !regexPatterns.password.test(value) ? 'Password must be 8-50 characters long, with at least one number, uppercase letter, lowercase letter, and special character.' : '';
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
            name: validateField('name', formData.name),
            email: validateField('email', formData.email),
            password: validateField('password', formData.password),
        };

        if (Object.values(errors).some(error => error)) {
            setFormData(prev => ({ ...prev, errors, errorMessage: '' }));
            return;
        }

        setFormData(prev => ({ ...prev, loading: true, errorMessage: '' }));

        try {
            const response = await fetch(`${backendURL}/user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('txnId', data.data.txnId);
                localStorage.setItem('email', true);
                navigate('/otp-verify');
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
        localStorage.removeItem('email');
        localStorage.removeItem('txnId');
        if (localStorage.getItem('accesstoken') && localStorage.getItem('refreshtoken')) {
            navigate('/recipes');
        }
    }, [navigate]);

    return (
        <main className={styles.container}>
            <section className={styles.formWrapper}>
                <div className={styles.card}>
                    <form className={styles.formFields} onSubmit={onSubmit} noValidate>
                        <h2 className={styles.formTitle}>Create an Account</h2>

                        <Input
                            id='name'
                            type='text'
                            label='Full Name'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            disabled={formData.loading} 
                        />
                        <Validation error={formData.errors.name} show={!!formData.errors.name} />

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

                        <Button type='submit' loading={formData.loading} disabled={formData.loading}>Sign Up</Button>
                        <Validation error={formData.errorMessage} show={!!formData.errorMessage} />

                        <p className={styles.signInText}>
                            Already have an account? <a href='/signin' className={styles.signInLink}>Sign In</a>
                        </p>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default SignUp;
