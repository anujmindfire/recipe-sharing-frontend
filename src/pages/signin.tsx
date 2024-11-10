import React from 'react';
import Link from 'next/link';
import Input from '../components/Input';
import Button from '../components/Button';
import Validation from '../components/Validation';
import ErrorBoundary from '../components/ErrorBoundary';
import '../styles/Forms.css'
import constant, { buttonType } from '../utils/constant';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setField, setErrors, setLoading, setErrorMessage } from '../store/context/signInSlice';
import { RootState } from '../store/redux/store';
import { validateField, createHandleChange } from '../validation/validation';
import { apiService } from '../apiService/service';
import { useClearLocalStorageAndRedirect } from '../utils/commonFunction';

const SignIn = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const formData = useSelector((state: RootState) => state.signIn);

    const handleChange = createHandleChange(dispatch, validateField, formData, setField, setErrors);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errors = {
            email: validateField(constant.inputLabel.email.type, formData.values.email, formData),
            password: validateField(constant.inputLabel.password.type, formData.values.password, formData),
        };

        if (Object.values(errors).some(error => error)) {
            dispatch(setErrors(errors));
            dispatch(setErrorMessage(''));
            return;
        }

        dispatch(setLoading(true));
        dispatch(setErrorMessage(''));

        const payload = {
            email: formData.values.email,
            password: formData.values.password,
        };

        const result = await apiService(payload, constant.apiLabel.signin);
        if (result.success) {
            constant.localStorageUtils.setItem(constant.localStorageKeys.accessToken, result.data.accessToken);
            constant.localStorageUtils.setItem(constant.localStorageKeys.refreshToken, result.data.refreshToken);
            constant.localStorageUtils.setItem(constant.localStorageKeys.userId, result.data.data.userId);
            constant.localStorageUtils.setItem(constant.localStorageKeys.userName, result.data.data.name);
            router.push(constant.routes.recipes);
        } else {
            dispatch(setErrorMessage(result.message));
        }

        dispatch(setLoading(false));
    };

    useClearLocalStorageAndRedirect(constant.routes.recipes)

    return (
        <ErrorBoundary>
            <main className='main-container'>
                <section className='form-section'>
                    <div className='form-container'>
                        <form className='form-input' onSubmit={onSubmit} noValidate>
                            <h2 className='form-heading'>{constant.label.welcome}</h2>

                            <Input
                                id={constant.inputLabel.email.type}
                                type={constant.inputLabel.email.type}
                                label={constant.inputLabel.email.label}
                                name={constant.inputLabel.email.type}
                                value={formData.values.email}
                                onChange={handleChange}
                                disabled={formData.loading}
                                tabIndex={1}
                            />
                            <Validation error={formData.errors.email} show={!!formData.errors.email} />

                            <Input
                                id={constant.inputLabel.password.type}
                                type={constant.inputLabel.password.type}
                                label={constant.inputLabel.password.label}
                                name={constant.inputLabel.password.type}
                                value={formData.values.password}
                                onChange={handleChange}
                                disabled={formData.loading}
                                tabIndex={2}
                            />
                            <Validation error={formData.errors.password} show={!!formData.errors.password} />

                            <Button type={buttonType.submit} loading={formData.loading}>
                                {constant.label.continue}
                            </Button>

                            <Validation error={formData.errorMessage} show={!!formData.errorMessage} />

                            <p className='form-footer'>
                                <Link href={constant.routes.forgotPassword} className='link'>{constant.label.forgotPassword}</Link>
                            </p>

                            <p className='form-footer'>
                                {constant.label.haveAccount} <Link href={constant.routes.signUp} className='link'>{constant.label.signup}</Link>
                            </p>
                        </form>
                    </div>
                </section>
            </main>
        </ErrorBoundary>
    );
};

export default SignIn;