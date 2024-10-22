import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Validation from '../components/Validation';
import Snackbar from '../components/Snackbar';
import styles from '../styles/AddRecipe.module.css';
import { validateField, createHandleChange } from '../validation/validation.js';
import { apiService } from '../apiService/Services.js';
import constant from '../utils/constant.js';

const initialState = {
    recipeTitle: '',
    ingredients: '',
    preparationSteps: '',
    description: '',
    preparationTime: '',
    cookingTime: '',
    imageUrl: '',
    errors: {
        recipeTitle: '',
        ingredients: '',
        preparationSteps: '',
        preparationTime: '',
        cookingTime: '',
        imageUrl: ''
    },
    loading: false,
    errorMessage: '',
    successMessage: '',
    showSnackbar: false,
    imageUploadSuccess: false
}

const AddRecipe = () => {
    const [formData, setFormData] = useState(initialState);
    const accesstoken = localStorage.getItem(constant.localStorageKeys.accessToken);
    const userId = localStorage.getItem(constant.localStorageKeys.userId);
    const handleChange = createHandleChange(setFormData);

    const handleImageChange = async (event) => {
        const selectedImage = event.target.files[0];

        if (selectedImage) {
            const validImageTypes = [constant.imageType.jpeg, constant.imageType.png];
            if (!validImageTypes.includes(selectedImage.type)) {
                setFormData((prevData) => ({
                    ...prevData,
                    errors: { ...prevData.errors, imageUrl: constant.validationMessage.invalidImage },
                    imageUploadSuccess: false
                }));
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('image', selectedImage);

            const result = await apiService(formDataToSend, constant.apiLabel.recipeImage);
            if (result.success) {
                setFormData((prevData) => ({
                    ...prevData,
                    imageUrl: result.data.imageUrl,
                    errorMessage: '',
                    errors: { ...prevData.errors, imageUrl: '' },
                    imageUploadSuccess: true
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    errors: { ...prevData.errors, imageUrl: result.message },
                }));
            }
        }
    };

    const handleCreateRecipe = async (e) => {
        e.preventDefault();

        const errors = {
            recipeTitle: validateField(constant.inputLabel.recipeTitle.id, formData.recipeTitle),
            ingredients: validateField(constant.inputLabel.ingredients.id, formData.ingredients),
            preparationSteps: validateField(constant.inputLabel.preparationSteps.id, formData.preparationSteps),
            description: validateField(constant.inputLabel.description.id, formData.description),
            preparationTime: validateField(constant.inputLabel.preparationTime.id, formData.preparationTime),
            cookingTime: validateField(constant.inputLabel.cookingTime.id, formData.cookingTime),
            imageUrl: validateField(constant.inputLabel.imageUrl.id, formData.imageUrl),
        };

        if (Object.values(errors).some(error => error)) {
            setFormData(prev => ({ ...prev, errors, errorMessage: '' }));
            return;
        }

        const payload = {
            title: formData.recipeTitle,
            ingredients: formData.ingredients,
            steps: formData.preparationSteps,
            description: formData.description,
            imageUrl: formData.imageUrl,
            preparationTime: formData.preparationTime,
            cookingTime: formData.cookingTime,
            accesstoken,
            userId
        };

        setFormData((prevData) => ({ ...prevData, isSubmitting: true }));

        const result = await apiService(payload, constant.apiLabel.addRecipe)
        if (result.success) {
            setFormData((prevData) => ({
                ...prevData,
                successMessage: result.data.message,
                showSnackbar: true,
            }));
            setTimeout(() => window.location.reload(), 1000);
        } else {
            setFormData((prevData) => ({
                ...prevData,
                errorMessage: result.message,
            }));
        }
    };

    const renderFormGroup = (constant, isTextarea = false) => (
        <div className={styles.formGroup}>
            <label htmlFor={constant.id}>{constant.label}</label>
            {isTextarea ? (
                <textarea
                    id={constant.id}
                    name={constant.id}
                    value={formData[constant.id]}
                    onChange={handleChange}
                    placeholder={constant.placeholder}
                    className={styles.textarea}
                />
            ) : (
                <Input
                    id={constant.id}
                    type={constant.type}
                    name={constant.id}
                    value={formData[constant.id]}
                    placeholder={constant.placeholder}
                    onChange={handleChange}
                    disabled={formData.loading}
                />
            )}
            <div style={{ marginTop: '10px' }}>
                {formData.errors[constant.id] && (
                    <Validation 
                        error={`${constant.label} is required`}
                        show={true} 
                    />
                )}
            </div>
        </div>
    );
    
    return (
        <main className={styles.container}>
            <form className={styles.form} onSubmit={handleCreateRecipe} noValidate>
                {renderFormGroup(constant.inputLabel.recipeTitle)}
                {renderFormGroup(constant.inputLabel.ingredients, true)}
                {renderFormGroup(constant.inputLabel.preparationSteps, true)}
                {renderFormGroup(constant.inputLabel.description, true)}
    
                <label className={styles.uploadButton}>
                    <input
                        type={constant.imageType.file}
                        accept={constant.imageType.accept}
                        className={styles.hiddenInput}
                        onChange={handleImageChange}
                    />
                    <span className={styles.buttonText}>
                        {formData.imageUploadSuccess ? constant.label.imageUpload : constant.label.chooseImage }
                    </span>
                </label>
    
                {renderFormGroup(constant.inputLabel.preparationTime)}
                {renderFormGroup(constant.inputLabel.cookingTime)}
    
                <Button type={constant.buttonType.submit} loading={formData.loading} disabled={formData.loading}>{constant.label.addRecipe}</Button>
    
                <Validation error={formData.errorMessage} show={!!formData.errorMessage} />

                <Snackbar isVisible={formData.showSnackbar} onClose={() => setFormData((prev) => ({ ...prev, showSnackbar: false }))} message={formData.successMessage} />
            </form>
        </main>
    );
};

export default AddRecipe;
