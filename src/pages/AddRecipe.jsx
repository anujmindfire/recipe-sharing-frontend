import React, { useState, useRef } from 'react';
import InputField from '../components/Input';
import Button from '../components/Button';
import Validation from '../components/Validation';
import Snackbar from '../components/Snackbar';
import styles from '../styles/AddRecipe.module.css';
import { backendURL } from '../api/url';
import { TextIgniter } from '@mindfiredigital/react-text-igniter';

const AddRecipe = () => {
    const [formData, setFormData] = useState({
        recipeTitle: '',
        ingredients: '',
        preparationSteps: '',
        description: '',
        preparationTime: '',
        cookingTime: '',
        imageUrl: '',
        errorMessage: '',
        showError: {},
        isSubmitting: false,
        successMessage: '',
        snackBar: false,
        imageUploadSuccess: false
    });

    const ingredientsEditorRef = useRef();
    const preparationStepsEditorRef = useRef();
    const descriptionEditorRef = useRef();

    const accesstoken = localStorage.getItem('accesstoken');
    const refreshtoken = localStorage.getItem('refreshtoken');
    const userId = localStorage.getItem('id');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            errorMessage: '',
            showError: { ...prevData.showError, [name]: false },
        }));
    };

    const handleImageChange = async (event) => {
        const selectedImage = event.target.files[0];

        if (selectedImage) {
            const validImageTypes = ['image/jpeg', 'image/png'];
            if (!validImageTypes.includes(selectedImage.type)) {
                setFormData((prevData) => ({
                    ...prevData,
                    errorMessage: 'Invalid file type. Please select a JPEG or PNG image.',
                    showError: { ...prevData.showError, imageUrl: true },
                }));
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('image', selectedImage);

            try {
                const response = await fetch(`${backendURL}/getS3Url`, {
                    method: 'POST',
                    body: formDataToSend,
                });

                const data = await response.json();
                if (response.ok) {
                    setFormData((prevData) => ({
                        ...prevData,
                        imageUrl: data.imageUrl,
                        errorMessage: '',
                        showError: { ...prevData.showError, imageUrl: false },
                        imageUploadSuccess: true
                    }));
                } else {
                    setFormData((prevData) => ({
                        ...prevData,
                        errorMessage: data.message,
                        showError: { ...prevData.showError, imageUrl: true },
                    }));
                }
            } catch (error) {
                setFormData((prevData) => ({
                    ...prevData,
                    errorMessage: 'Something went wrong while uploading the image.',
                    showError: { ...prevData.showError, imageUrl: true },
                }));
            }
        }
    };

    const handleGetEditorContent = () => {
        const ingredients = ingredientsEditorRef.current.getHtml();
        const preparationSteps = preparationStepsEditorRef.current.getHtml();
        const description = descriptionEditorRef.current.getHtml();
        return { ingredients, preparationSteps, description };
    };

    const isFormValid = () => {
        const { recipeTitle, ingredients, preparationSteps, imageUrl, preparationTime, cookingTime } = formData;
        const errors = {};
        if (!recipeTitle) errors.recipeTitle = true;
        if (!ingredients) errors.ingredients = true;
        if (!preparationSteps) errors.preparationSteps = true;
        if (!imageUrl) errors.imageUrl = true;
        if (!preparationTime) errors.preparationTime = true;
        if (!cookingTime) errors.cookingTime = true;
        setFormData((prevData) => ({ ...prevData, showError: errors }));
        return Object.keys(errors).length === 0;
    };

    const handleCreateRecipe = async (e) => {
        e.preventDefault();

        const { ingredients, preparationSteps, description } = handleGetEditorContent();

        setFormData((prevData) => ({
            ...prevData,
            ingredients,
            preparationSteps,
            description,
        }));

        if (!isFormValid()) {
            return;
        }

        const recipeData = {
            title: formData.recipeTitle,
            ingredients: ingredients,
            steps: preparationSteps,
            description: description,
            imageUrl: formData.imageUrl,
            preparationTime: formData.preparationTime,
            cookingTime: formData.cookingTime,
        };

        setFormData((prevData) => ({ ...prevData, isSubmitting: true }));

        try {
            const response = await fetch(`${backendURL}/recipe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accesstoken': accesstoken,
                    'refreshtoken': refreshtoken,
                    'id': userId,
                },
                body: JSON.stringify(recipeData),
            });

            const data = await response.json();

            if (response.ok) {
                setFormData((prevData) => ({
                    ...prevData,
                    successMessage: data.message,
                    snackBar: true,
                }));
                setTimeout(() => window.location.reload(), 1000);
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    errorMessage: data.message,
                    showError: { ...prevData.showError, form: true },
                }));
            }
        } catch (error) {
            setFormData((prevData) => ({
                ...prevData,
                errorMessage: 'Something went wrong while creating the recipe.',
                showError: { ...prevData.showError, form: true },
            }));
        } finally {
            setFormData((prevData) => ({ ...prevData, isSubmitting: false }));
        }
    };

    const renderFormGroup = (label, name, type, placeholder, isEditor = false) => (
        <div className={styles.formGroup}>
            <label htmlFor={name}>{label}</label>
            {isEditor ? (
                <TextIgniter
                    ref={name === 'ingredients' ? ingredientsEditorRef : name === 'preparationSteps' ? preparationStepsEditorRef : descriptionEditorRef}
                    features={['bold', 'italic', 'underline', 'orderedList', 'unorderedList']}
                    height={'100px'}
                />
            ) : (
                <InputField
                    id={name}
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                />
            )}
            <div style={{ marginTop: '10px' }}>
                {formData.showError[name] && (
                    <Validation error={`${label} is required`} show={true} />
                )}
            </div>
        </div>
    );    

    return (
        <main className={styles.container}>
            <form className={styles.form} onSubmit={handleCreateRecipe} noValidate>
                {renderFormGroup('Recipe Title', 'recipeTitle', 'name', 'Enter the title of your recipe')}
                {renderFormGroup('Ingredients', 'ingredients', 'text', 'Enter ingredients', true)}
                {renderFormGroup('Preparation Steps', 'preparationSteps', 'text', 'Enter steps', true)}
                {renderFormGroup('Description', 'description', 'text', 'Enter description', true)}

                <label className={styles.uploadButton}>
                    <input
                        type='file'
                        accept='image/*'
                        className={styles.hiddenInput}
                        onChange={handleImageChange}
                    />
                    <span className={styles.buttonText}>
                        {formData.imageUploadSuccess ? 'Image successfully uploaded.' : 'Choose Image'}
                    </span>
                </label>

                {renderFormGroup('Preparation Time', 'preparationTime', 'name', 'Enter preparation time')}
                {renderFormGroup('Cooking Time', 'cookingTime', 'name', 'Enter cooking time')}

                <Validation error={formData.errorMessage} show={!!formData.errorMessage} />

                <Button type='submit' loading={formData.isSubmitting} disabled={formData.isSubmitting}>
                    Add Recipe
                </Button>

                <Snackbar isVisible={formData.snackBar} onClose={() => setFormData((prev) => ({ ...prev, snackBar: false }))} message={formData.successMessage} />
            </form>
        </main>
    );
};

export default AddRecipe;
