import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../styles/Form.module.css';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Validation from '../components/Validation.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import { validateField, createHandleChange } from '../validation/validation.js';
import { apiService } from '../apiService/services.js';
import constant from '../utils/constant.js';
import { useClearLocalStorageAndRedirect } from '../utils/commonFunction.js';

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
    const handleChange = createHandleChange(setFormData);

    const onSubmit = async (e) => {
        e.preventDefault();

        const errors = {
            email: validateField(constant.inputLabel.email.type, formData.email),
            password: validateField(constant.inputLabel.password.type, formData.password),
        };

        if (Object.values(errors).some(error => error)) {
            setFormData(prev => ({ ...prev, errors, errorMessage: '' }));
            return;
        }

        const payload = {
            email: formData.email, 
            password: formData.password
        }

        setFormData(prev => ({ ...prev, loading: true, errorMessage: '' }));

        const result = await apiService(payload, constant.apiLabel.signin);
        if (result.success) {
            constant.localStorageUtils.setItem(constant.localStorageKeys.accessToken, result.data.accessToken);
            constant.localStorageUtils.setItem(constant.localStorageKeys.refreshToken, result.data.refreshToken);
            constant.localStorageUtils.setItem(constant.localStorageKeys.userId, result.data.data.userId);
            constant.localStorageUtils.setItem(constant.localStorageKeys.userName, result.data.data.name);
            navigate(constant.routes.recipes);
        } else {
            setFormData(prev => ({ ...prev, errorMessage: result.message }));
        }

        setFormData(prev => ({ ...prev, loading: false }));
    };

    useClearLocalStorageAndRedirect(constant.routes.recipes);

    return (
        <main className={styles.container}>
            <section className={styles.formWrapper}>
                <div className={styles.card}>
                    <form className={styles.formFields} onSubmit={onSubmit} noValidate>
                        <h2 className={styles.formTitle}>{constant.label.welcome}</h2>

                        <Input
                            id={constant.inputLabel.email.type}
                            type={constant.inputLabel.email.type}
                            label={constant.inputLabel.email.label}
                            name={constant.inputLabel.email.type}
                            value={formData.email}
                            onChange={handleChange}
                            disabled={formData.loading}
                            tabIndex='1'
                        />
                        <Validation error={formData.errors.email} show={!!formData.errors.email} />

                        <Input
                            id={constant.inputLabel.password.type}
                            type={constant.inputLabel.password.type}
                            label={constant.inputLabel.password.label}
                            name={constant.inputLabel.password.type}
                            value={formData.password}
                            onChange={handleChange}
                            disabled={formData.loading}
                            tabIndex='2'
                        />
                        <Validation error={formData.errors.password} show={!!formData.errors.password} />

                        <Button 
                            type={constant.buttonType.submit} 
                            loading={formData.loading} 
                            disabled={formData.loading}
                            tabIndex='3'
                        >
                            {constant.label.continue}
                        </Button>

                        <Validation error={formData.errorMessage} show={!!formData.errorMessage} />

                        <p className={styles.signInText}>
                            <Link to={constant.routes.forgotPassword} className={styles.signInLink} tabIndex='4'>{constant.label.forgotPassword}</Link>
                        </p>

                        <p className={styles.signInText}>
                            {constant.label.haveAccount} <Link to={constant.routes.signUp} className={styles.signInLink} tabIndex='5'>{constant.label.signup}</Link>
                        </p>
                    </form>
                </div>
            </section>
        </main>
    );
};

const SignInWithErrorBoundary = () => (
    <ErrorBoundary>
        <SignIn />
    </ErrorBoundary>
);

export default SignInWithErrorBoundary;
