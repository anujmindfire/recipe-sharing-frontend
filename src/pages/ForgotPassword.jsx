import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../styles/Form.module.css';
import Input from '../components/Input';
import Button from '../components/Button';
import Snackbar from '../components/Snackbar';
import Validation from '../components/Validation';
import { validateField, createHandleChange } from '../validation/validation.js';
import { apiService } from '../apiService/Services.js';
import constant from '../utils/constant.js';
import { useClearLocalStorageAndRedirect } from '../utils/commonFunction.js';

const initialState = {
    email: '',
    errors: { email: '' },
    loading: false,
    errorMessage: '',
    showSnackbar: false,
    successMessage: ''
};

const ForgotPassword = () => {
    const [formData, setFormData] = useState(initialState);
    const navigate = useNavigate();
    const handleChange = createHandleChange(setFormData);

    const onSubmit = async (e) => {
        e.preventDefault();

        const errors = {
            email: validateField(constant.inputLabel.email.type, formData.email),
        };

        if (Object.values(errors).some(error => error)) {
            setFormData(prev => ({ ...prev, errors, errorMessage: '' }));
            return;
        }

        const payload = { email: formData.email }

        setFormData(prev => ({ ...prev, loading: true, errorMessage: '' }));

        const result = await apiService(payload, constant.apiLabel.forgotPassword);

        if (result.success) {
            setFormData(prev => ({
                ...prev,
                showSnackbar: true,
                successMessage: result.data.message
            }));
            constant.localStorageUtils.setItem(constant.localStorageKeys.txnId, result.data.data.txnId);
            constant.localStorageUtils.setItem(constant.localStorageKeys.email, true);
            setTimeout(() => navigate(constant.routes.signIn), 2000);
        } else {
            setFormData(prev => ({ ...prev, loading: false, errorMessage: result.message }));
        }
    };

    useClearLocalStorageAndRedirect(constant.routes.recipes);

    return (
        <main className={styles.container}>
            <section className={styles.formWrapper}>
                <div className={styles.card}>
                    <form className={styles.formFields} onSubmit={onSubmit} noValidate>
                        <h2 className={styles.formTitle}>{constant.label.resetPassword}</h2>

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

                        <Button type={constant.buttonType.submit} loading={formData.loading} disabled={formData.loading}>
                            {constant.label.sendLink}
                        </Button>

                        <Validation error={formData.errorMessage} show={!!formData.errorMessage} />

                        <p className={styles.signInText}>
                            {constant.label.rememberPassword}{' '}
                            <Link to={constant.routes.signIn} className={styles.signInLink}>
                                {constant.label.signIn}
                            </Link>
                        </p>
                    </form>
                </div>
            </section>

            <Snackbar
                message={formData.successMessage}
                isVisible={formData.showSnackbar}
                onClose={() => setFormData(prev => ({ ...prev, showSnackbar: false }))}
            />
        </main>
    );
};

export default ForgotPassword;
