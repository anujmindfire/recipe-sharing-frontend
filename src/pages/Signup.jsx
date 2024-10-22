import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../styles/Form.module.css';
import Input from '../components/Input';
import Button from '../components/Button';
import Validation from '../components/Validation';
import { validateField, createHandleChange } from '../validation/validation.js';
import { apiService } from '../apiService/Services.js';
import constant from '../utils/constant.js';
import { useClearLocalStorageAndRedirect } from '../utils/commonFunction.js';

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
    const handleChange = createHandleChange(setFormData);

    const onSubmit = async (e) => {
        e.preventDefault();

        const errors = {
            name: validateField(constant.inputLabel.name.id, formData.name),
            email: validateField(constant.inputLabel.email.type, formData.email),
            password: validateField(constant.inputLabel.password.type, formData.password),
        };

        if (Object.values(errors).some(error => error)) {
            setFormData(prev => ({ ...prev, errors, errorMessage: '' }));
            return;
        }

        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password
        }

        setFormData(prev => ({ ...prev, loading: true, errorMessage: '' }));

        const result = await apiService(payload, constant.apiLabel.signup);
        if (result.success) {
            constant.localStorageUtils.setItem(constant.localStorageKeys.txnId, result.data.data.txnId);
            constant.localStorageUtils.setItem(constant.localStorageKeys.email, true)
            navigate(constant.routes.otpVerify);
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
                        <h2 className={styles.formTitle}>{constant.label.createAccount}</h2>

                        <Input
                            id={constant.inputLabel.name.id}
                            type={constant.inputLabel.name.type}
                            label={constant.inputLabel.name.label}
                            name={constant.inputLabel.name.id}
                            value={formData.name}
                            onChange={handleChange}
                            disabled={formData.loading}
                        />
                        <Validation error={formData.errors.name} show={!!formData.errors.name} />

                        <Input
                            id={constant.inputLabel.email.type}
                            type={constant.inputLabel.email.type}
                            label={constant.inputLabel.email.label}
                            name={constant.inputLabel.email.type}
                            value={formData.email}
                            onChange={handleChange}
                            disabled={formData.loading}
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
                        />
                        <Validation error={formData.errors.password} show={!!formData.errors.password} />

                        <Button type={constant.buttonType.submit} loading={formData.loading} disabled={formData.loading}>{constant.label.signup}</Button>
                        <Validation error={formData.errorMessage} show={!!formData.errorMessage} />

                        <p className={styles.signInText}>
                            {constant.label.alreadyHaveAccount} <Link to={constant.routes.signIn} className={styles.signInLink}>{constant.label.signIn}</Link>
                        </p>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default SignUp;
