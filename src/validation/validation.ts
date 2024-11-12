import DOMPurify from 'dompurify';
import regex from './regex';
import constant from '../utils/constant';
import { FormDataProps } from '../interface/Interface';

type ValidateFn<T> = (name: keyof T, value: string, formData: T) => string;

/**
 * Validates a form field based on its name and value.
 * This function checks the value against regex patterns and ensures the length is within the required range for specific fields.
 * It returns an appropriate validation message or an empty string if the value is valid.
 * 
 * @param {string} name - The name of the field being validated.
 * @param {string} value - The value of the field being validated.
 * @param {FormDataProps} formData - The current form data containing all the field values and errors.
 * @returns {string} A validation message if validation fails, or an empty string if validation passes.
 */

const validateField = (
    name: string,
    value: string,
    formData: FormDataProps
): string => {
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
            return value !== formData.values.password
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

/**
 * Creates an event handler for form field changes that validates the input and updates the state.
 * This function sanitizes the input value using DOMPurify, validates the value with a validation function,
 * and dispatches actions to update the field value and errors in the form state.
 * 
 * @param {React.Dispatch<any>} dispatch - The dispatch function to update the state.
 * @param {ValidateFn<T>} validateFn - The validation function to validate the field value.
 * @param {T} formData - The current form data to be passed to the validation function.
 * @param {Function} setFieldAction - The action creator to update the field value in the form state.
 * @param {Function} setErrorsAction - The action creator to update the form validation errors in the state.
 * @returns {Function} A function to handle field changes and update the state.
 */
const createHandleChange = <T extends Record<string, any>>(
    dispatch: React.Dispatch<any>,
    validateFn: ValidateFn<T>,
    formData: T,
    setFieldAction: (payload: { name: string; value: string }) => void,
    setErrorsAction: (payload: { [key: string]: string }) => void
) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const sanitizedValue = DOMPurify.sanitize(value);
        const error = validateFn(name, sanitizedValue, formData);
        dispatch(setFieldAction({ name, value: sanitizedValue }));
        dispatch(setErrorsAction({ ...formData.errors, [name]: error }));
    };
};

export { validateField, createHandleChange };