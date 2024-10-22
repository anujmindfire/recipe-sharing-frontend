import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignIn from '../pages/Signin';
import { apiService } from '../apiService/Services';
import constant from '../utils/constant';
import '@testing-library/jest-dom';

jest.mock('../apiService/Services');
jest.mock('../utils/commonFunction', () => ({
    useClearLocalStorageAndRedirect: jest.fn(),
}));

describe('SignIn Component', () => {
    const renderComponent = () => {
        return render(
            <BrowserRouter>
                <SignIn />
            </BrowserRouter>
        );
    };

    test('renders SignIn form correctly', () => {
        renderComponent();

        expect(screen.getByText(constant.label.welcome)).toBeInTheDocument();
        expect(screen.getByLabelText(constant.inputLabel.email.label)).toBeInTheDocument();
        expect(screen.getByLabelText(constant.inputLabel.password.label)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: constant.label.continue })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: constant.label.forgotPassword })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: constant.label.signup })).toBeInTheDocument();
    });

    test('shows validation errors on empty submit', async () => {
        renderComponent();

        fireEvent.click(screen.getByRole('button', { name: constant.label.continue }));

        // Wait for validation messages to appear
        await waitFor(() => {
            expect(screen.getByText(constant.validationMessage.invalidEmail)).toBeInTheDocument();
            expect(screen.getByText(constant.validationMessage.invalidPassword)).toBeInTheDocument();
        });
    });

    test('handles input changes correctly', () => {
        renderComponent();

        const emailInput = screen.getByLabelText(constant.inputLabel.email.label);
        const passwordInput = screen.getByLabelText(constant.inputLabel.password.label);

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('Password123!');
    });

    test('submits the form and calls API service on successful validation', async () => {
        // Mock the API call response
        apiService.mockResolvedValueOnce({
            success: true,
            message: 'Sign In Successful',
            data: {
                accessToken: 'access_token',
                refreshToken: 'refresh_token',
                data: {
                    userId: 'user_id', // Ensure this matches your actual response structure
                    name: 'User Name'
                }
            },
        });
    
        // Mock localStorage setItem
        const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    
        renderComponent();
    
        // Simulate input changes
        fireEvent.change(screen.getByLabelText(constant.inputLabel.email.label), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(constant.inputLabel.password.label), { target: { value: 'Password123!' } });
    
        // Simulate form submission
        fireEvent.click(screen.getByRole('button', { name: constant.label.continue }));
    
        // Wait for the API service to be called
        await waitFor(() => {
            expect(apiService).toHaveBeenCalledWith(
                {
                    email: 'test@example.com',
                    password: 'Password123!',
                },
                constant.apiLabel.signin
            );
        });
    
        // Check that localStorage was updated correctly
        expect(setItemSpy).toHaveBeenCalledWith(constant.localStorageKeys.accessToken, 'access_token');
        expect(setItemSpy).toHaveBeenCalledWith(constant.localStorageKeys.refreshToken, 'refresh_token');
        expect(setItemSpy).toHaveBeenCalledWith(constant.localStorageKeys.userId, 'user_id');
        expect(setItemSpy).toHaveBeenCalledWith(constant.localStorageKeys.userName, 'User Name');
    
        // Clean up the spy
        setItemSpy.mockRestore();
    });

    test('shows error message if API call fails', async () => {
        // Mock the API call to fail
        apiService.mockResolvedValueOnce({
            success: false,
            message: 'Invalid email or password.'
        });

        renderComponent();

        // Simulate input changes
        fireEvent.change(screen.getByLabelText(constant.inputLabel.email.label), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(constant.inputLabel.password.label), { target: { value: 'Password123!' } });

        // Simulate form submission
        fireEvent.click(screen.getByRole('button', { name: constant.label.continue }));

        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText('Invalid email or password.')).toBeInTheDocument();
        });
    });

    test('navigates to forgot password page', () => {
        renderComponent();

        // Click on the forgot password link
        fireEvent.click(screen.getByRole('link', { name: constant.label.forgotPassword }));

        // Assert that the URL has changed to the forgot password route
        expect(window.location.pathname).toBe(constant.routes.forgotPassword);
    });

    test('navigates to sign up page', () => {
        renderComponent();

        // Click on the sign up link
        fireEvent.click(screen.getByRole('link', { name: constant.label.signup }));

        // Assert that the URL has changed to the sign up route
        expect(window.location.pathname).toBe(constant.routes.signUp);
    });
});
