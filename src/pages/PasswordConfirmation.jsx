import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Snackbar from '../components/Snackbar';
import Validation from '../components/Validation';
import Button from '../components/Button';
import styles from '../styles/Form.module.css';
import { validateField, createHandleChange } from '../validation/validation.js';
import { apiService } from '../apiService/Services.js';
import constant from '../utils/constant.js';

const initialState = {
    password: '',
    confirmPassword: '',
    errors: { password: '', confirmPassword: '' },
    loading: false,
    showSnackbar: false,
    successMessage: '',
    errorMessage: ''
}

const PasswordConfirmation = () => {
    const [formData, setFormData] = useState(initialState);
    const { txnId } = useParams();
    const navigate = useNavigate();
    const handleChange = createHandleChange(setFormData);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const errors = {
            password: validateField(constant.inputLabel.password.type, formData.password, formData),
            confirmPassword: validateField(constant.inputLabel.confirmPassword.type, formData.confirmPassword, formData),
        };
    
        if (Object.values(errors).some(error => error)) {
            setFormData(prev => ({ ...prev, errors, errorMessage: '' }));
            return;
        }
    
        const payload = {
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            txnId
        };
    
        const result = await apiService(payload, constant.apiLabel.passwordConfirmation);
        if (result.success) {
            setFormData({
                loading: false,
                showSnackbar: true,
                successMessage: result.data.message,
            });
            localStorage.removeItem(constant.localStorageKeys.email);
            localStorage.removeItem(constant.localStorageKeys.txnId);
            setTimeout(() => navigate(constant.routes.signIn), 2000);
        } else {
            handleErrorResponse(result.data);
        }
    };

    const handleErrorResponse = (data) => {
        setFormData((prev) => ({
            ...prev,
            loading: false,
            errorMessage: data.message
        }));
        if (data.message === constant.validationMessage.linkExpired) {
            setTimeout(() => navigate(constant.routes.forgotPassword), 1000);
        }
    };

    useEffect(() => {
        if (!constant.localStorageUtils.getItem(constant.localStorageKeys.email)
            && !constant.localStorageUtils.getItem(constant.localStorageKeys.txnId)) {
            navigate(constant.routes.forgotPassword);
        }
    }, [navigate]);

    useEffect(() => {
        const handleUnload = () => constant.localStorageUtils.setItem(constant.localStorageKeys.isLeavingPasswordPage, constant.localStorageKeys.isLeavingPasswordPageValue);
        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, []);

    useEffect(() => {
        let matchTxnId = txnId === constant.localStorageUtils.getItem(constant.localStorageKeys.txnId);
        if (!matchTxnId) {
            navigate(constant.routes.forgotPassword);
        }
        if (Number(constant.localStorageUtils.getItem(constant.localStorageKeys.isLeavingPasswordPage)) === constant.localStorageKeys.isLeavingPasswordPageValue && matchTxnId) {
            constant.localStorageUtils.setItem(constant.localStorageKeys.isLeavingPasswordPage, constant.localStorageKeys.isLeavingPasswordPageValue2);
            navigate(constant.routes.forgotPassword);
        } else if (Number(constant.localStorageUtils.getItem(constant.localStorageKeys.isLeavingPasswordPageValue2)) === constant.localStorageKeys.isLeavingPasswordPageValue2 && matchTxnId) {
            localStorage.removeItem(constant.localStorageKeys.isLeavingPasswordPage);
        }
    }, [navigate, txnId]);

    return (
        <main className={styles.container}>
            <section className={styles.formWrapper}>
                <div className={styles.card}>
                    <form className={styles.formFields} onSubmit={handleSubmit} noValidate>
                        <h2 className={styles.formTitle}>{constant.label.resetPassword}</h2>

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

                        <Input
                            id={constant.inputLabel.confirmPassword.type}
                            type={constant.inputLabel.password.type}
                            label={constant.inputLabel.confirmPassword.label}
                            name={constant.inputLabel.confirmPassword.type}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={formData.loading}
                        />

                        <Validation error={formData.errors.confirmPassword} show={!!formData.errors.confirmPassword} />

                        <Button type={constant.buttonType.submit} loading={formData.loading} disabled={formData.loading}>
                            {constant.label.resetPasswordLabel}
                        </Button>

                        <Validation error={formData.errorMessage} show={!!formData.errorMessage} />
                    </form>
                </div>
            </section>

            <Snackbar
                message={formData.successMessage}
                isVisible={formData.showSnackbar}
                onClose={() => setFormData((prev) => ({ ...prev, showSnackbar: false }))}
            />
        </main>
    );
};

export default PasswordConfirmation;
