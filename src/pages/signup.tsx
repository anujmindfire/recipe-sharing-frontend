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
import { setField, setErrors, setLoading, setErrorMessage } from '../store/context/signUpSlice';
import { RootState } from '../store/redux/store';
import { validateField, createHandleChange } from '../validation/validation';
import { apiService } from '../apiService/service';
import { useClearLocalStorageAndRedirect } from '../utils/commonFunction';

const SignUp = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const formData = useSelector((state: RootState) => state.signUp);

    const handleChange = createHandleChange(dispatch, validateField, formData, setField, setErrors);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errors = {
            name: validateField(constant.inputLabel.name.id, formData.values.name, formData),
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
            name: formData.values.name,
            email: formData.values.email,
            password: formData.values.password,
        };

        const result = await apiService(payload, constant.apiLabel.signup);
        if (result.success) {
            constant.localStorageUtils.setItem(constant.localStorageKeys.txnId, result.data.data.txnId);
            constant.localStorageUtils.setItem(constant.localStorageKeys.email, 'true')
            router.push(constant.routes.otpVerify);
        } else {
            dispatch(setErrorMessage(result.message));
        }

        dispatch(setLoading(false));
    };

    useClearLocalStorageAndRedirect(constant.routes.recipes);

    return (
        <ErrorBoundary>
            <main className='main-container'>
                <section className='form-section'>
                    <div className='form-container'>
                        <form className='form-input' onSubmit={onSubmit} noValidate>
                            <h2 className='form-heading'>{constant.label.createAccount}</h2>

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

                            <Input
                                id={constant.inputLabel.email.type}
                                type={constant.inputLabel.email.type}
                                label={constant.inputLabel.email.label}
                                name={constant.inputLabel.email.type}
                                value={formData.values.email}
                                onChange={handleChange}
                                disabled={formData.loading}
                                tabIndex={2}
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
                                tabIndex={3}
                            />
                            <Validation error={formData.errors.password} show={!!formData.errors.password} />

                            <Button type={buttonType.submit} loading={formData.loading}>
                                {constant.label.signup}
                            </Button>

                            <Validation error={formData.errorMessage} show={!!formData.errorMessage} />

                            <p className='form-footer'>
                                {constant.label.alreadyHaveAccount} <Link href={constant.routes.signIn} className='link'>{constant.label.signIn}</Link>
                            </p>
                        </form>
                    </div>
                </section>
            </main>
        </ErrorBoundary>
    );
};

export default SignUp;
