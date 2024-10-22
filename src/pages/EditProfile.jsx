import React, { useCallback, useEffect, useState } from 'react';
import styles from '../styles/Form.module.css';
import Button from '../components/Button';
import Snackbar from '../components/Snackbar';
import InputField from '../components/Input';
import Validation from '../components/Validation';
import { validateField, createHandleChange } from '../validation/validation.js';
import { apiService } from '../apiService/Services.js';
import constant from '../utils/constant.js';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        bio: '',
        favouriteRecipe: '',
        loading: false,
        errorMessage: '',
        successMessage: '',
        showSnackbar: false,
        errors: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const { loading, successMessage, showSnackbar, errorMessage } = formData;
    const accesstoken = localStorage.getItem(constant.localStorageKeys.accessToken);
    const userId = localStorage.getItem(constant.localStorageKeys.userId);
    const handleChange = createHandleChange(setFormData);

    const fetchUser = useCallback(async () => {
        setFormData((prevState) => ({ ...prevState, loading: true }));

        const payload = { accesstoken, userId }
        const result = await apiService(payload, constant.apiLabel.oneUser);
        if (result.success) {
            const { name = '', email = '', bio = '', favouriteRecipe = '' } = result.data.data;
            setFormData((prev) => ({
                ...prev,
                name,
                email,
                bio,
                favouriteRecipe
            }));
        } else {
            setFormData(prev => ({ ...prev, errorMessage: result.message }));
        }
        setFormData((prevState) => ({ ...prevState, loading: false }));
    }, [accesstoken, userId]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {
            name: validateField(constant.inputLabel.name.id, formData.name),
            email: validateField(constant.inputLabel.email.type, formData.email),
            bio: validateField(constant.inputLabel.bio.name, formData.bio),
            favouriteRecipe: validateField(constant.inputLabel.favouriteRecipe.name, formData.favouriteRecipe),
            ...(formData.password && { 
                password: validateField(constant.inputLabel.password.type, formData.password),
                confirmPassword: validateField(constant.inputLabel.confirmPassword.type, formData.confirmPassword, formData),
            }),
        };

        if (Object.values(errors).some(error => error)) {
            setFormData(prev => ({ ...prev, errors, errorMessage: '' }));
            return;
        }

        const updatedFields = {
            name: formData.name,
            bio: formData.bio,
            favouriteRecipe: formData.favouriteRecipe,
            accesstoken,
            userId
        };

        if (formData.password && formData.password === formData.confirmPassword) {
            updatedFields.password = formData.password;
            updatedFields.confirmPassword = formData.confirmPassword;
        }

        setFormData(prev => ({ ...prev, loading: true, errorMessage: '' }));

        const result = await apiService(updatedFields, constant.apiLabel.updateUserProfile);
        if (result.success) {
            setFormData(prev => ({
                ...prev,
                successMessage: result.data.message,
                showSnackbar: true,
            }));
            setTimeout(() => window.location.reload(), 1000);
        } else {
            setFormData(prev => ({ ...prev, errorMessage: result.message }));
        }
        setFormData(prev => ({ ...prev, loading: false }));
    };

    return (
        <main className={styles.editContainer}>
            <section className={styles.formSection}>
                <form className={styles.inputFields} onSubmit={handleSubmit} noValidate>
                    <div className={styles.formFieldGroup}>
                        <InputField
                            id={constant.inputLabel.name.id}
                            type={constant.inputLabel.name.type}
                            label={constant.inputLabel.name.label}
                            name={constant.inputLabel.name.id}
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                            className={styles.inputField}
                        />
                        <Validation error={formData.errors.name} show={!!formData.errors.name} />
                    </div>

                    <div className={styles.formFieldGroup}>
                        <InputField
                            id={constant.inputLabel.email.type}
                            type={constant.inputLabel.email.type}
                            label={constant.inputLabel.email.label}
                            name={constant.inputLabel.email.type}
                            value={formData.email}
                            onChange={handleChange}
                            disabled={true}
                            className={styles.inputField}
                        />
                        <Validation error={formData.errors.email} show={!!formData.errors.email} />
                    </div>

                    <div className={styles.formFieldGroup}>
                        <InputField
                            id={constant.inputLabel.password.type}
                            type={constant.inputLabel.password.type}
                            label={constant.inputLabel.password.label}
                            name={constant.inputLabel.password.type}
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            className={styles.inputField}
                        />
                        <Validation error={formData.errors.password} show={!!formData.errors.password} />
                    </div>

                    <div className={styles.formFieldGroup}>
                        <InputField
                            id={constant.inputLabel.confirmPassword.type}
                            type={constant.inputLabel.password.type}
                            label={constant.inputLabel.confirmPassword.label}
                            name={constant.inputLabel.confirmPassword.type}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={loading}
                            className={styles.inputField}
                        />
                        <Validation error={formData.errors.confirmPassword} show={!!formData.errors.confirmPassword} />
                    </div>

                    <div className={styles.formFieldGroup}>
                        <InputField
                            label={constant.inputLabel.bio.label}
                            name={constant.inputLabel.bio.name}
                            type={constant.inputLabel.bio.type}
                            value={formData.bio}
                            onChange={handleChange}
                            disabled={loading}
                            className={styles.inputField}
                        />
                    </div>

                    <div className={styles.formFieldGroup}>
                        <InputField
                            label={constant.inputLabel.favouriteRecipe.label}
                            name={constant.inputLabel.favouriteRecipe.name}
                            type={constant.inputLabel.favouriteRecipe.type}
                            value={formData.favouriteRecipe}
                            onChange={handleChange}
                            disabled={loading}
                            className={styles.inputField}
                        />
                    </div>

                    {errorMessage && <Validation error={errorMessage} show={!!errorMessage} />}

                    <Button type={constant.buttonType.submit} loading={loading} disabled={loading}>
                        {constant.label.updateProfile}
                    </Button>
                </form>

                {showSnackbar && (
                    <Snackbar message={successMessage} onClose={() => setFormData((prev) => ({ ...prev, showSnackbar: false }))} isVisible={showSnackbar} />
                )}
            </section>
        </main>
    );
};

export default EditProfile;