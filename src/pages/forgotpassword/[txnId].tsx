import React, { useEffect } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Snackbar from '../../components/Snackbar';
import Validation from '../../components/Validation';
import ErrorBoundary from '../../components/ErrorBoundary';
import '../../styles/Forms.css'
import constant, { buttonType } from '../../utils/constant';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setField, setErrors, setLoading, setErrorMessage, setSuccessMessage, toggleSnackbar } from '../../store/context/passwordConfirmSlice';
import { RootState } from '../../store/redux/store';
import { validateField, createHandleChange } from '../../validation/validation';
import { apiService } from '../../apiService/service';

const PasswordConfirmation = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { txnId } = router.query;
    const formData = useSelector((state: RootState) => state.passwordConfirmation);

    const handleChange = createHandleChange(dispatch, validateField, formData, setField, setErrors);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errors = {
            password: validateField(constant.inputLabel.password.type, formData.values.password, formData),
            confirmPassword: validateField(constant.inputLabel.confirmPassword.type, formData.values.confirmPassword, formData),
        };

        if (Object.values(errors).some(error => error)) {
            dispatch(setErrors(errors));
            dispatch(setErrorMessage(''));
            return;
        }

        dispatch(setLoading(true));
        dispatch(setErrorMessage(''));

        const payload = {
            password: formData.values.password,
            confirmPassword: formData.values.confirmPassword,
            txnId
        };

        const result = await apiService(payload, constant.apiLabel.passwordConfirmation);

        if (result.success) {
            dispatch(setSuccessMessage(result.data.message));
            dispatch(toggleSnackbar(true));
            localStorage.removeItem(constant.localStorageKeys.email);
            localStorage.removeItem(constant.localStorageKeys.txnId);
            setTimeout(() => router.push(constant.routes.signIn), 2000);
        } else {
            handleErrorResponse(result);
        }

        dispatch(setLoading(false));
    };

    const handleErrorResponse = (data: any) => {
        dispatch(setLoading(false));
        dispatch(setErrorMessage(data.message));

        if (data.message === constant.validationMessage.linkExpired) {
            setTimeout(() => router.push(constant.routes.forgotPassword), 1000);
        }
    };

    useEffect(() => {
        if (!constant.localStorageUtils.getItem(constant.localStorageKeys.email)
            && !constant.localStorageUtils.getItem(constant.localStorageKeys.txnId)) {
            router.push(constant.routes.forgotPassword);
        }
    }, [router]);

    useEffect(() => {
        if (txnId) {
            let matchTxnId = txnId === constant.localStorageUtils.getItem(constant.localStorageKeys.txnId);
            if (!matchTxnId) {
                router.push(constant.routes.forgotPassword);
            }
            if (constant.localStorageUtils.getItem(constant.localStorageKeys.isLeavingPasswordPage) === constant.localStorageKeys.isLeavingPasswordPageValue && matchTxnId) {
                constant.localStorageUtils.setItem(constant.localStorageKeys.isLeavingPasswordPage, constant.localStorageKeys.isLeavingPasswordPageValue2);
                router.push(constant.routes.forgotPassword);
            } else if (constant.localStorageUtils.getItem(constant.localStorageKeys.isLeavingPasswordPageValue2) === constant.localStorageKeys.isLeavingPasswordPageValue2 && matchTxnId) {
                localStorage.removeItem(constant.localStorageKeys.isLeavingPasswordPage);
            }
        }
    }, [router, txnId]);

    return (
        <ErrorBoundary>
            <main className='main-container'>
                <section className='form-section'>
                    <div className='form-container'>
                        <form className='form-input' onSubmit={onSubmit} noValidate>
                            <h2 className='form-heading'>{constant.label.resetPassword}</h2>

                            <Input
                                id={constant.inputLabel.password.type}
                                type={constant.inputLabel.password.type}
                                label={constant.inputLabel.password.label}
                                name={constant.inputLabel.password.type}
                                value={formData.values.password}
                                onChange={handleChange}
                                disabled={formData.loading}
                                tabIndex={1}
                            />

                            <Validation error={formData.errors.password} show={!!formData.errors.password} />

                            <Input
                                id={constant.inputLabel.confirmPassword.type}
                                type={constant.inputLabel.password.type}
                                label={constant.inputLabel.confirmPassword.label}
                                name={constant.inputLabel.confirmPassword.type}
                                value={formData.values.confirmPassword}
                                onChange={handleChange}
                                disabled={formData.loading}
                                tabIndex={2}
                            />

                            <Validation error={formData.errors.confirmPassword} show={!!formData.errors.confirmPassword} />

                            <Button type={buttonType.submit} loading={formData.loading}>
                                {constant.label.resetPasswordLabel}
                            </Button>

                            <Validation error={formData.errorMessage} show={!!formData.errorMessage} />
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

export default PasswordConfirmation;