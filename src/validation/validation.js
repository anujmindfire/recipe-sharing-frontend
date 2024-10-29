import DOMPurify from 'dompurify';
import regex from './regex.js';
import constant from '../utils/constant.js';

const validateField = (name, value, formData) => {
    switch (name) {
        case constant.inputLabel.name.id:
            return !regex.auth.name.test(value)
                ? constant.validationMessage.invalidName
                : value.length < constant.inputLabel.name.minLength || value.length > constant.inputLabel.name.maxLength
                    ? constant.validationMessage.invalidLength
                    : '';
        case constant.inputLabel.email.type:
            return !regex.auth.email.test(value)
                ? constant.validationMessage.invalidEmail
                : '';
        case constant.inputLabel.password.type:
            return value.length === constant.inputLabel.password.length || !regex.auth.password.test(value)
                ? constant.validationMessage.invalidPassword
                : '';
        case constant.inputLabel.confirmPassword.type:
            return value !== formData.password
                ? constant.validationMessage.invalidConfirmPassword
                : '';
        case constant.inputLabel.recipeTitle.id:
            if (value.length < constant.inputLabel.recipeTitle.minLength) {
                return constant.validationMessage.required(constant.inputLabel.recipeTitle.label);
            } else if (value.length > constant.inputLabel.recipeTitle.maxLength) {
                return constant.validationMessage.tooLong(constant.inputLabel.recipeTitle.label, constant.inputLabel.recipeTitle.maxLength);
            }
            return '';
        case constant.inputLabel.ingredients.id:
            return value.length < constant.inputLabel.recipeTitle.minLength
                ? constant.validationMessage.required(constant.inputLabel.ingredients.label)
                : '';
        case constant.inputLabel.preparationSteps.id:
            return value.length < constant.inputLabel.recipeTitle.minLength
                ? constant.validationMessage.required(constant.inputLabel.preparationSteps.label)
                : '';
        case constant.inputLabel.preparationTime.id:
            return value.length < constant.inputLabel.recipeTitle.minLength
                ? constant.validationMessage.required(constant.inputLabel.preparationTime.label)
                : '';
        case constant.inputLabel.cookingTime.id:
            return value.length < constant.inputLabel.recipeTitle.minLength
                ? constant.validationMessage.required(constant.inputLabel.cookingTime.label)
                : '';
        case constant.inputLabel.imageUrl.id:
            return value.length < constant.inputLabel.recipeTitle.minLength
                ? constant.validationMessage.required(constant.inputLabel.imageUrl.name)
                : '';
        case constant.inputLabel.bio.name:
            return value.length > constant.inputLabel.bio.maxLength
                ? constant.validationMessage.tooLong(constant.inputLabel.bio.label, 500)
                : '';
        case constant.inputLabel.favouriteRecipe.name:
            return value.length > constant.inputLabel.recipeTitle.maxLength
                ? constant.validationMessage.tooLong(constant.inputLabel.favouriteRecipe.label, 100)
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