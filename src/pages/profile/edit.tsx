import Button from '../../components/Button';
import Snackbar from '../../components/Snackbar';
import Input from '../../components/Input';
import Validation from '../../components/Validation';
import ErrorBoundary from '../../components/ErrorBoundary';
import constant, { buttonType } from '../../utils/constant';
import authenicateRoute from '../../utils/authenticatedRouteGuard';
import ProfileLayout from './index';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setField, setErrors, setLoading, setErrorMessage, setSuccessMessage, toggleSnackbar } from '../../store/context/editProfileSlice';
import { RootState } from '../../store/redux/store';
import { validateField, createHandleChange } from '../../validation/validation';
import { apiService } from '../../apiService/service';

const EditProfile = () => {
    const dispatch = useDispatch();
    const formData = useSelector((state: RootState) => state.editProfile);
    const handleChange = createHandleChange(dispatch, validateField, formData, setField, setErrors);

    const accesstoken = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.accessToken) : null;
    const userId = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.userId) : null;

    const fetchUser = useCallback(async () => {
        dispatch(setLoading(true));

        const payload = { accesstoken, userId }
        const result = await apiService(payload, constant.apiLabel.oneUser);

        if (result.success) {
            const { name, email, bio, favouriteRecipe } = result.data.data;
            dispatch(setField({ name: constant.inputLabel.name.id, value: name }));
            dispatch(setField({ name: constant.inputLabel.email.type, value: email }));
            dispatch(setField({ name: constant.inputLabel.bio.name, value: bio }));
            dispatch(setField({ name: constant.inputLabel.favouriteRecipe.name, value: favouriteRecipe }));
        } else {
            dispatch(setErrorMessage(result.message));
            dispatch(setLoading(false));
        }
        dispatch(setLoading(false));
    }, [accesstoken, userId]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errors = {
            name: validateField(constant.inputLabel.name.id, formData.values.name, formData),
            email: validateField(constant.inputLabel.email.type, formData.values.email, formData),
            bio: validateField(constant.inputLabel.bio.name, formData.values.bio, formData),
            favouriteRecipe: validateField(constant.inputLabel.favouriteRecipe.name, formData.values.favouriteRecipe, formData),
            ...(formData.values.password && {
                password: validateField(constant.inputLabel.password.type, formData.values.password, formData),
                confirmPassword: validateField(constant.inputLabel.confirmPassword.type, formData.values.confirmPassword, formData),
            }),
        };

        if (Object.values(errors).some(error => error)) {
            dispatch(setErrors(errors));
            dispatch(setErrorMessage(''));
            return;
        }

        dispatch(setLoading(true));
        dispatch(setErrorMessage(''));

        const updatedFields: {
            name: string;
            bio: string;
            favouriteRecipe: string;
            accesstoken: string | null;
            userId: string | null;
            password?: string;
            confirmPassword?: string;
        } = {
            name: formData.values.name,
            bio: formData.values.bio,
            favouriteRecipe: formData.values.favouriteRecipe,
            accesstoken,
            userId
        };

        if (formData.values.password && formData.values.password === formData.values.confirmPassword) {
            updatedFields.password = formData.values.password;
            updatedFields.confirmPassword = formData.values.confirmPassword;
        }

        const result = await apiService(updatedFields, constant.apiLabel.updateUserProfile);
        if (result.success) {
            dispatch(setSuccessMessage(result.data.message));
            dispatch(toggleSnackbar(true))
        } else {
            dispatch(setErrorMessage(result.message));
        }

        dispatch(setLoading(false));
    };

    useEffect(() => {
        document.body.style.overflow = constant.label.hidden;
        return () => {
            document.body.style.overflow = constant.label.auto;
        };
    }, []);

    return (
        <ErrorBoundary>
            <ProfileLayout>
                <main className='flex min-h-screen w-full items-center justify-center text-[#adadad] p-5 font-sans text-base'>
                    <section className='flex w-full max-w-[600px] p-10 flex-col items-center justify-center mb-[210px]'>
                        <form className='flex flex-col w-full gap-4 py-2' onSubmit={onSubmit} noValidate>
                            <div className='w-full flex flex-col gap-4'>
                                <Input
                                    id={constant.inputLabel.name.id}
                                    type={constant.inputLabel.name.type}
                                    label={constant.inputLabel.name.label}
                                    name={constant.inputLabel.name.id}
                                    value={formData.values.name}
                                    onChange={handleChange}
                                    disabled={formData.loading}
                                    tabIndex={1}
                                />
                                <Validation error={formData.errors.name} show={!!formData.errors.name} />
                            </div>

                            <div className='w-full flex flex-col gap-4'>
                                <Input
                                    id={constant.inputLabel.email.type}
                                    type={constant.inputLabel.email.type}
                                    label={constant.inputLabel.email.label}
                                    name={constant.inputLabel.email.type}
                                    value={formData.values.email}
                                    onChange={handleChange}
                                    disabled={true}
                                    tabIndex={2}
                                />
                                <Validation error={formData.errors.email} show={!!formData.errors.email} />
                            </div>

                            <div className='w-full flex flex-col gap-4'>
                                <Input
                                    id={constant.inputLabel.password.type}
                                    type={constant.inputLabel.password.type}
                                    label={constant.inputLabel.password.label}
                                    name={constant.inputLabel.password.type}
                                    value={formData.values.password}
                                    onChange={handleChange}
                                    disabled={formData.loading}
                                    tabIndex={3}
                                />
                                <Validation error={formData.errors.password} show={!!formData.errors.password} />
                            </div>

                            <div className='w-full flex flex-col gap-4'>
                                <Input
                                    id={constant.inputLabel.confirmPassword.type}
                                    type={constant.inputLabel.password.type}
                                    label={constant.inputLabel.confirmPassword.label}
                                    name={constant.inputLabel.confirmPassword.type}
                                    value={formData.values.confirmPassword}
                                    onChange={handleChange}
                                    disabled={formData.loading}
                                    tabIndex={4}
                                />
                                <Validation error={formData.errors.confirmPassword} show={!!formData.errors.confirmPassword} />
                            </div>

                            <div className='w-full flex flex-col gap-4'>
                                <Input
                                    id={constant.inputLabel.bio.name}
                                    label={constant.inputLabel.bio.label}
                                    name={constant.inputLabel.bio.name}
                                    type={constant.inputLabel.bio.type}
                                    value={formData.values.bio}
                                    onChange={handleChange}
                                    disabled={formData.loading}
                                    tabIndex={5}
                                />
                            </div>

                            <div className='w-full flex flex-col gap-4'>
                                <Input
                                    id={constant.inputLabel.bio.name}
                                    label={constant.inputLabel.favouriteRecipe.label}
                                    name={constant.inputLabel.favouriteRecipe.name}
                                    type={constant.inputLabel.favouriteRecipe.type}
                                    value={formData.values.favouriteRecipe}
                                    onChange={handleChange}
                                    disabled={formData.loading}
                                    tabIndex={6}
                                />
                            </div>

                            {formData.errorMessage && <Validation error={formData.errorMessage} show={!!formData.errorMessage} />}

                            <Button type={buttonType.submit} loading={formData.loading}>
                                {constant.label.updateProfile}
                            </Button>
                        </form>

                        {formData.showSnackbar && (
                            <Snackbar
                                message={formData.successMessage}
                                isVisible={formData.showSnackbar}
                                onClose={() => dispatch(toggleSnackbar(false))}
                            />
                        )}
                    </section>
                </main>
            </ProfileLayout>
        </ErrorBoundary>
    );
}

export default authenicateRoute(EditProfile);