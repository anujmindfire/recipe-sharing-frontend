import DOMPurify from 'dompurify';
import regex from './regex.js';
import constant from '../utils/constant';

const validateField = (name, value, formData) => {
    switch (name) {
        case 'name':
            return !regex.auth.name.test(value)
                ? `${constant.validationMessage.invalidName}`
                : value.length < 2 || value.length > 50
                    ? `${constant.validationMessage.invalidLength}`
                    : '';
        case 'email':
            return !regex.auth.email.test(value)
                ? `${constant.validationMessage.invalidEmail}`
                : '';
        case 'password':
            return value.length === 0 || !regex.auth.password.test(value)
                ? `${constant.validationMessage.invalidPassword}`
                : '';
        case 'confirmPassword':
            return value !== formData.password
                ? `${constant.validationMessage.invalidConfirmPassword}`
                : '';
        case 'recipeTitle':
            return value.length < 1
                ? 'Recipe title is required.'
                : value.length > 100
                    ? 'Recipe title is too long.'
                    : '';
        case 'ingredients':
            return value.length < 1
                ? 'Ingredients are required.'
                : '';
        case 'preparationSteps':
            return value.length < 1
                ? 'Preparation steps are required.'
                : '';
        case 'preparationTime':
            return value.length < 1
                ? 'Preparation time is required.'
                : '';
        case 'cookingTime':
            return value.length < 1
                ? 'Cooking time is required.'
                : '';
        case 'imageUrl':
            return value.length < 1
                ? 'Image is required.'
                : '';
        case 'bio':
            return value.length > 500
                ? 'Bio is too long.'
                : '';
        case 'favouriteRecipe':
            return value.length > 100
                ? 'Recipe name is too long.'
                : '';

        default:
            return '';
    }
};

const createHandleChange = (setFormData) => {
    return (e) => {
        const { name, value } = e.target;
        const sanitizedValue = DOMPurify.sanitize(value);

        setFormData((prev) => {
            const newErrors = {
                ...prev.errors,
                [name]: validateField(name, sanitizedValue, prev)
            };
            return { ...prev, [name]: sanitizedValue, errors: newErrors };
        });
    };
};

export {
    validateField,
    createHandleChange,
}