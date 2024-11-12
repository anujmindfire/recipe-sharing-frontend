import Input from '../../components/Input';
import Button from '../../components/Button';
import Validation from '../../components/Validation';
import Snackbar from '../../components/Snackbar';
import ErrorBoundary from '../../components/ErrorBoundary';
import authenicateRoute from '../../utils/authenticatedRouteGuard';
import constant, { buttonType } from '../../utils/constant';
import { ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setField, setErrors, setLoading, setErrorMessage, setSuccessMessage, toggleSnackbar, setImageUploadSuccess } from '../../store/context/appRecipeSlice';
import { RootState } from '../../store/redux/store';
import { validateField, createHandleChange } from '../../validation/validation';
import { AddRecipeProps } from '../../interface/Interface';
import { apiService } from '../../apiService/service';

const AddRecipe = () => {
    const dispatch = useDispatch();
    const formData = useSelector((state: RootState) => state.addRecipe) as AddRecipeProps;

    const accesstoken = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.accessToken) : null;
    const userId = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.userId) : null;

    const handleChange = createHandleChange(dispatch, validateField, formData, setField, setErrors);

    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const selectedImage = event.target.files?.[0];

        if (selectedImage) {
            const validImageTypes = [constant.imageType.jpeg, constant.imageType.png];
            if (!validImageTypes.includes(selectedImage.type)) {
                dispatch(setErrors({ ...formData.errors, imageUrl: constant.validationMessage.invalidImage }));
                dispatch(setImageUploadSuccess(false));
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('image', selectedImage);

            const result = await apiService(formDataToSend, constant.apiLabel.recipeImage);
            if (result.success) {
                dispatch(setField({ name: 'imageUrl', value: result.data.imageUrl }));
                dispatch(setErrors({ ...formData.errors, imageUrl: '' }));
                dispatch(setImageUploadSuccess(true));
            } else {
                dispatch(setErrors({ ...formData.errors, imageUrl: result.message }));
            }
        }
    };

    const handleCreateRecipe = async (e: FormEvent) => {
        e.preventDefault();

        dispatch(setLoading(true));

        const errors = {
            recipeTitle: validateField(constant.inputLabel.recipeTitle.id, formData.values.recipeTitle, formData),
            ingredients: validateField(constant.inputLabel.ingredients.id, formData.values.ingredients, formData),
            preparationSteps: validateField(constant.inputLabel.preparationSteps.id, formData.values.preparationSteps, formData),
            description: validateField(constant.inputLabel.description.id, formData.values.description, formData),
            preparationTime: validateField(constant.inputLabel.preparationTime.id, formData.values.preparationTime, formData),
            cookingTime: validateField(constant.inputLabel.cookingTime.id, formData.values.cookingTime, formData),
            imageUrl: validateField(constant.inputLabel.imageUrl.id, formData.values.imageUrl, formData),
        };

        if (Object.values(errors).some((error) => error)) {
            dispatch(setErrors(errors));
            return;
        }

        const payload = {
            title: formData.values.recipeTitle,
            ingredients: formData.values.ingredients,
            steps: formData.values.preparationSteps,
            description: formData.values.description,
            imageUrl: formData.values.imageUrl,
            preparationTime: formData.values.preparationTime,
            cookingTime: formData.values.cookingTime,
            accesstoken,
            userId,
        };

        const result = await apiService(payload, constant.apiLabel.addRecipe);
        if (result.success) {
            dispatch(setSuccessMessage(result.data.message));
            dispatch(toggleSnackbar(true));
            dispatch(setLoading(false));
            setTimeout(() => window.location.reload(), 1000);
        } else {
            dispatch(setErrorMessage(result.message));
            dispatch(setLoading(false));
        }
        dispatch(setLoading(false));
    };

    const renderFormGroup = (
        constant: {
            id: keyof AddRecipeProps['values'];
            label: string;
            placeholder: string;
            type: string;
        },
        isTextarea = false
    ) => (
        <div className='w-full flex flex-col mb-4'>
            <label htmlFor={constant.id} className='text-white text-sm font-medium mb-2'>{constant.label}</label>
            {isTextarea ? (
                <textarea
                    id={constant.id}
                    name={constant.id}
                    value={formData.values[constant.id]}
                    onChange={handleChange}
                    placeholder={constant.placeholder}
                    className='w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 resize-y min-h-[120px]'
                />
            ) : (
                <Input
                    id={constant.id}
                    type={constant.type}
                    name={constant.id}
                    value={formData.values[constant.id]}
                    placeholder={constant.placeholder}
                    onChange={handleChange}
                    disabled={formData.loading}
                    tabIndex={1}
                />
            )}
            {formData.errors[constant.id as keyof typeof formData.errors] && (
                <Validation
                    error={formData.errors[constant.id as keyof typeof formData.errors]}
                    show={true}
                />
            )}
        </div>
    );

    return (
        <ErrorBoundary>
            <main className='flex flex-col items-center min-h-screen bg-gray-900 p-6'>
                <h2 className='text-white text-3xl font-bold mb-8'>{constant.label.createRecipe}</h2>
                <form className='w-full max-w-lg space-y-6' onSubmit={handleCreateRecipe} noValidate>
                    {renderFormGroup({ id: 'recipeTitle', label: 'Recipe Title', placeholder: 'Enter Recipe Title', type: 'text' })}
                    {renderFormGroup({ id: 'ingredients', label: 'Ingredients', placeholder: 'Enter Ingredients', type: 'textarea' }, true)}
                    {renderFormGroup({ id: 'preparationSteps', label: 'Preparation Steps', placeholder: 'Enter Steps', type: 'textarea' }, true)}
                    {renderFormGroup({ id: 'description', label: 'Description', placeholder: 'Enter Description', type: 'textarea' }, true)}

                    <label className='w-full flex justify-center items-center bg-gray-700 text-white font-medium py-3 px-4 rounded-md cursor-pointer transition-all duration-300 hover:bg-gray-600'>
                        <input
                            type='file'
                            accept='image/*'
                            className='hidden'
                            onChange={handleImageChange}
                        />
                        <span>{formData.imageUploadSuccess ? constant.label.imageUpload : constant.label.chooseImage}</span>
                    </label>

                    {formData.errors.imageUrl && (
                        <Validation error={formData.errors.imageUrl} show={true}/>
                    )}

                    {renderFormGroup({ id: 'preparationTime', label: 'Preparation Time', placeholder: 'Enter Preparation Time', type: 'text' })}
                    {renderFormGroup({ id: 'cookingTime', label: 'Cooking Time', placeholder: 'Enter Cooking Time', type: 'text' })}

                    <Button type={buttonType.submit} loading={formData.loading}>
                        {constant.label.addRecipe}
                    </Button>

                    <Validation error={formData.errorMessage} show={!!formData.errorMessage}/>

                    <Snackbar
                        message={formData.successMessage}
                        isVisible={formData.showSnackbar}
                        onClose={() => dispatch(toggleSnackbar(false))}
                    />
                </form>
            </main>
        </ErrorBoundary>
    );
};

export default authenicateRoute(AddRecipe);
