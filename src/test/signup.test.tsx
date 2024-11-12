import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SignUp from '../pages/signup';
import signUpReducer from '../store/context/signUpSlice';
import '@testing-library/jest-dom';
import { apiService } from '../apiService/service';
import constant from '../utils/constant';

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../apiService/service');
const pushMock = jest.fn();
const mockApiService = apiService as jest.MockedFunction<typeof apiService>;

const renderWithProviders = (component: JSX.Element) => {
    const store = configureStore({ reducer: { signUp: signUpReducer } });

    return render(
        <Provider store={store}>
            {component}
        </Provider>
    );
};

describe(constant.signUpTest.components, () => {
    beforeEach(() => {
        jest.clearAllMocks();

        pushMock.mockReturnValue({
            pathname: '/signup',
            push: pushMock,
        });
        (jest.mocked(require('next/router')).useRouter as jest.Mock) = pushMock;
    });

    test(constant.signInTest.renderComponent, () => {
        renderWithProviders(<SignUp />);
        expect(screen.getByText(constant.label.createAccount)).toBeInTheDocument();
    });

    test(constant.signUpTest.handleInput, async () => {
        renderWithProviders(<SignUp />);
        const nameInput = screen.getByLabelText(constant.inputLabel.name.label);
        const emailInput = screen.getByLabelText(constant.inputLabel.email.label);
        const passwordInput = screen.getByLabelText(constant.inputLabel.password.label);

        await userEvent.type(nameInput, constant.signUpTest.mockData.name);
        await userEvent.type(emailInput, constant.signInTest.mockData.email);
        await userEvent.type(passwordInput, constant.signInTest.mockData.password);

        expect(nameInput).toHaveValue(constant.signUpTest.mockData.name);
        expect(emailInput).toHaveValue(constant.signInTest.mockData.email);
        expect(passwordInput).toHaveValue(constant.signInTest.mockData.password);
    });

    test(constant.signInTest.validError, async () => {
        renderWithProviders(<SignUp />);
        const submitButton = screen.getByRole('button', { name: constant.label.signup });
        fireEvent.click(submitButton);
        
        expect(await screen.findByText(/Name can only contain letters and spaces./i)).toBeInTheDocument();
        expect(await screen.findByText(/Please enter a valid email address./i)).toBeInTheDocument();
        expect(await screen.findByText(/Password must be 8-50 characters long, with at least one number, uppercase letter, lowercase letter, and special character/i)).toBeInTheDocument();
    });

    test(constant.signInTest.validError, async () => {
        renderWithProviders(<SignUp />);
        const emailInput = screen.getByLabelText(constant.inputLabel.email.label);
        await userEvent.type(emailInput, 'invalid-email');
        const submitButton = screen.getByRole('button', { name: constant.label.signup });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/Please enter a valid email address./i)).toBeInTheDocument();
    });

    test(constant.signInTest.apiFail, async () => {
        mockApiService.mockResolvedValue({ success: false, message: 'Invalid credentials' });
    
        renderWithProviders(<SignUp />);

        const nameInput = screen.getByLabelText(constant.inputLabel.name.label);
        const emailInput = screen.getByLabelText(constant.inputLabel.email.label);
        const passwordInput = screen.getByLabelText(constant.inputLabel.password.label);
    
        // Type invalid credentials
        await userEvent.type(nameInput, constant.signUpTest.mockData.name);
        await userEvent.type(emailInput, constant.signInTest.mockData.email);
        await userEvent.type(passwordInput, constant.signInTest.mockData.invalidPassword);
    
        const submitButton = screen.getByRole('button', { name: constant.label.signup });
        fireEvent.click(submitButton);
    
        // Wait for the error message to appear and check it
        const errorMessage = await screen.findByText(/Password must be 8-50 characters long/i);
        expect(errorMessage).toBeInTheDocument();
    });
});