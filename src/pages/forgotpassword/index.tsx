import React from 'react';
import Link from 'next/link';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Snackbar from '../../components/Snackbar';
import Validation from '../../components/Validation';
import ErrorBoundary from '../../components/ErrorBoundary';
import '../../styles/Forms.css'
import constant, { buttonType } from '../../utils/constant';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setField, setErrors, setLoading, setErrorMessage, setSuccessMessage, toggleSnackbar } from '../../store/context/forgotPasswordSlice';
import { RootState } from '../../store/redux/store';
import { validateField, createHandleChange } from '../../validation/validation';
import { apiService } from '../../apiService/service';
import { useClearLocalStorageAndRedirect } from '../../utils/commonFunction';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const formData = useSelector((state: RootState) => state.forgotPassword);

    const handleChange = createHandleChange(dispatch, validateField, formData, setField, setErrors);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errors = {
            email: validateField(constant.inputLabel.email.type, formData.values.email, formData),
        };

        if (Object.values(errors).some(error => error)) {
            dispatch(setErrors(errors));
            dispatch(setErrorMessage(''));
            return;
        }
        
        dispatch(setLoading(true));
        dispatch(setErrorMessage(''));

        const payload = { email: formData.values.email };

        const result = await apiService(payload, constant.apiLabel.forgotPassword);

        if (result.success) {
            dispatch(setSuccessMessage(result.data.message));
            dispatch(toggleSnackbar(true));
            constant.localStorageUtils.setItem(constant.localStorageKeys.txnId, result.data.data.txnId);
            constant.localStorageUtils.setItem(constant.localStorageKeys.email, 'true');
            setTimeout(() => router.push(constant.routes.signIn), 2000);
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
                            <h2 className='form-heading'>{constant.label.resetPassword}</h2>

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

                            <Button type={buttonType.submit} loading={formData.loading}>
                                {constant.label.sendLink}
                            </Button>

                            <Validation error={formData.errorMessage} show={!!formData.errorMessage} />

                            <p className='form-footer'>
                                {constant.label.rememberPassword}{' '}
                                <Link href={constant.routes.signIn} className='link'>{constant.label.signIn}</Link>
                            </p>
                        </form>
                    </div>
                </section>

                <Snackbar
                    message={formData.successMessage}
                    isVisible={formData.showSnackbar}
                    onClose={() => dispatch(toggleSnackbar(false))}
                />
            </main>
        </ErrorBoundary>
    );
};

export default ForgotPassword;