import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Form.module.css';
import Button from '../components/Button';
import Snackbar from '../components/Snackbar';
import { backendURL } from '../api/url';
import { refreshAccessToken } from '../utils/tokenServices';
import DOMPurify from 'dompurify';
import InputField from '../components/Input';
import Validation from '../components/Validation';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        bio: '',
        favouriteRecipe: '',
        isLoading: false,
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

    const { isLoading, successMessage, showSnackbar, errorMessage } = formData;
    const accesstoken = localStorage.getItem('accesstoken');
    const refreshtoken = localStorage.getItem('refreshtoken');
    const userId = localStorage.getItem('id');
    const navigate = useNavigate();

    const handleFetchError = useCallback((data, response) => {
        if (response.status === 401 || data.unauthorized) {
            return refreshAccessToken(refreshtoken, userId, navigate);
        } else if (data.message) {
            setFormData((prev) => ({ ...prev, errorMessage: data.message }));
        }
    }, [refreshtoken, userId, navigate]);

    const fetchUser = useCallback(async () => {
        setFormData((prevState) => ({ ...prevState, isLoading: true }));
        try {
            const response = await fetch(`${backendURL}/user?_id=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    accesstoken,
                    id: userId,
                },
            });
    
            const data = await response.json();
            if (response.ok) {
                const { name = '', email = '', bio = '', favouriteRecipe = '' } = data.data;
    
                setFormData((prev) => ({
                    ...prev,
                    name,
                    email,
                    bio,
                    favouriteRecipe,
                }));
            } else {
                handleFetchError(data, response);
            }
        } catch (error) {
            setFormData((prev) => ({ ...prev, errorMessage: 'Something went wrong.' }));
        } finally {
            setFormData((prev) => ({ ...prev, isLoading: false }));
        }
    }, [accesstoken, handleFetchError, userId]);    

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = DOMPurify.sanitize(value);
        const error = validateField(name, sanitizedValue);

        setFormData((prev) => ({
            ...prev,
            [name]: sanitizedValue,
            errors: {
                ...prev.errors,
                [name]: error,
            },
        }));
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!/^[A-Za-z\s]+$/.test(value)) return 'Name can only contain letters and spaces.';
                if (value.length < 2 || value.length > 50) return 'Name should be greater than 2 and less than 50 characters.';
                return '';
            case 'email':
                if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format.';
                return '';
            case 'password':
                if (value && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,50}$/.test(value)) {
                    return 'Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.';
                }
                return '';
            case 'confirmPassword':
                return value !== formData.password ? 'Passwords do not match.' : '';
            default:
                return '';
        }
    };

    const validateForm = () => {
        const { name, email, password, confirmPassword } = formData;
        const errors = {
            name: validateField('name', name),
            email: validateField('email', email),
            password: validateField('password', password),
            confirmPassword: validateField('confirmPassword', confirmPassword),
        };

        setFormData((prev) => ({ ...prev, errors }));

        return !Object.values(errors).some((error) => error);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setFormData((prev) => ({ ...prev, isLoading: true }));

        try {
            const updatedFields = {};
            const { name, password, confirmPassword, bio, favouriteRecipe } = formData;

            if (name) updatedFields.name = name;
            if (bio) updatedFields.bio = bio;
            if (favouriteRecipe) updatedFields.favouriteRecipe = favouriteRecipe;

            if (password && password === confirmPassword) {
                updatedFields.password = password;
                updatedFields.confirmPassword = confirmPassword;
            }

            const response = await fetch(`${backendURL}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    accesstoken,
                    id: userId,
                },
                body: JSON.stringify(updatedFields),
            });

            const data = await response.json();
            if (response.ok) {
                setFormData((prev) => ({
                    ...prev,
                    successMessage: data.message,
                    showSnackbar: true,
                }));
                setTimeout(() => window.location.reload(), 1000);
            } else {
                handleFetchError(data, response);
            }
        } catch (error) {
            setFormData((prev) => ({ ...prev, errorMessage: error.message }));
        } finally {
            setFormData((prev) => ({ ...prev, isLoading: false }));
        }
    };

    return (
        <main className={styles.editContainer}>
            <section className={styles.formSection}>
                <form className={styles.inputFields} onSubmit={handleSubmit} noValidate>
                    <div className={styles.formFieldGroup}>
                        <InputField
                            id='name'
                            className={styles.inputField}
                            type='text'
                            label='Name'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <Validation error={formData.errors.name} show={!!formData.errors.name} />
                    </div>

                    <div className={styles.formFieldGroup}>
                        <InputField
                            id='email'
                            className={styles.inputField}
                            type='email'
                            label='Email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            disabled={true}
                        />
                        <Validation error={formData.errors.email} show={!!formData.errors.email} />
                    </div>

                    <div className={styles.formFieldGroup}>
                        <InputField
                            id='password'
                            className={styles.inputField}
                            type='password'
                            label='Password'
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <Validation error={formData.errors.password} show={!!formData.errors.password} />
                    </div>

                    <div className={styles.formFieldGroup}>
                        <InputField
                            id='confirmPassword'
                            className={styles.inputField}
                            type='password'
                            label='Confirm Password'
                            name='confirmPassword'
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <Validation error={formData.errors.confirmPassword} show={!!formData.errors.confirmPassword} />
                    </div>

                    <div className={styles.formFieldGroup}>
                        <InputField
                            label='Bio'
                            name='bio'
                            className={styles.inputField}
                            type='textarea'
                            value={formData.bio}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.formFieldGroup}>
                        <InputField
                            label='Favourite Recipe'
                            name='favouriteRecipe'
                            className={styles.inputField}
                            type='text'
                            value={formData.favouriteRecipe}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>

                    {errorMessage && <Validation error={errorMessage} show={!!errorMessage} />}

                    <Button type='submit' loading={isLoading} disabled={isLoading}>
                        Update Profile
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