import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from '../pages/Signup';
import { apiService } from '../apiService/Services';
import constant from '../utils/constant';
import '@testing-library/jest-dom';

jest.mock('../apiService/Services');
jest.mock('../utils/commonFunction', () => ({
    useClearLocalStorageAndRedirect: jest.fn(),
}));

describe('SignUp Component', () => {
    const renderComponent = () => {
        return render(
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        );
    };

    test('renders SignUp form correctly', () => {
        renderComponent();

        expect(screen.getByText(constant.label.createAccount)).toBeInTheDocument();
        expect(screen.getByLabelText(constant.inputLabel.name.label)).toBeInTheDocument();
        expect(screen.getByLabelText(constant.inputLabel.email.label)).toBeInTheDocument();
        expect(screen.getByLabelText(constant.inputLabel.password.label)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: constant.label.signup })).toBeInTheDocument();
    });

    test('shows validation errors on empty submit', async () => {
        renderComponent();
    
        fireEvent.click(screen.getByRole('button', { name: constant.label.signup }));
    
        // Wait for validation messages to appear
        await waitFor(() => {
            expect(screen.getByText(constant.validationMessage.invalidName)).toBeInTheDocument();
            expect(screen.getByText(constant.validationMessage.invalidEmail)).toBeInTheDocument();
            expect(screen.getByText(constant.validationMessage.invalidPassword)).toBeInTheDocument();
        });
    });

    test('handles input changes correctly', () => {
        renderComponent();

        const nameInput = screen.getByLabelText(constant.inputLabel.name.label);
        const emailInput = screen.getByLabelText(constant.inputLabel.email.label);
        const passwordInput = screen.getByLabelText(constant.inputLabel.password.label);

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'Password123@!!' } });

        expect(nameInput.value).toBe('John Doe');
        expect(emailInput.value).toBe('john.doe@example.com');
        expect(passwordInput.value).toBe('Password123@!!');
    });

    test('submits the form and calls API service on successful validation', async () => {
        // Mock the API call response
        apiService.mockResolvedValueOnce({
            success: true,
            message: 'OTP Sent Successfully',
            data: {
                data: {
                    txnId: '12345'
                }
            },
        });
    
        // Mock localStorage setItem
        const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    
        renderComponent();
    
        // Simulate input changes
        fireEvent.change(screen.getByLabelText(constant.inputLabel.name.label), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(constant.inputLabel.email.label), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByLabelText(constant.inputLabel.password.label), { target: { value: 'Password123@!!' } });
    
        // Simulate form submission
        fireEvent.click(screen.getByRole('button', { name: constant.label.signup }));
    
        // Wait for the API service to be called
        await waitFor(() => {
            expect(apiService).toHaveBeenCalledWith(
                {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    password: 'Password123@!!',
                },
                constant.apiLabel.signup
            );
        });
    
        // Check that localStorage was updated correctly
        expect(setItemSpy).toHaveBeenCalledWith(constant.localStorageKeys.txnId, '12345');
        expect(setItemSpy).toHaveBeenCalledWith(constant.localStorageKeys.email, true);
    
        // Clean up the spy
        setItemSpy.mockRestore();
    });
    
    test('shows error message if API call fails', async () => {
        // Mock the API call to fail
        apiService.mockResolvedValueOnce({
            success: false,
            message: 'Something went wrong'
        });
    
        renderComponent();
    
        // Simulate input changes
        fireEvent.change(screen.getByLabelText(constant.inputLabel.name.label), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(constant.inputLabel.email.label), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByLabelText(constant.inputLabel.password.label), { target: { value: 'Password123@!!' } });
    
        // Simulate form submission
        fireEvent.click(screen.getByRole('button', { name: constant.label.signup }));
    
        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        });
    });
});
