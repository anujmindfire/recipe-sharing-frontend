import React from 'react';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import ErrorBoundary from '../components/ErrorBoundary';
import constant from '../utils/constant';

/**
 * NotFound component that handles the 404 error page when a user navigates to a non-existent route.
 * It displays a message indicating that the page is not found and provides a button to redirect
 * the user to the home page or sign-in page based on their authentication status.
 * 
 * Uses ErrorBoundary to catch and display any errors that may occur within the component.
 * 
 * A 404 error page with a message and a button to navigate the user back to the home page or sign-in page.
 */

const NotFound = () => {
    const router = useRouter();

    const handleGoBackHome = () => {
        const accesstoken = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.accessToken) : null;

        if (accesstoken) {
            router.push(constant.routes.recipes);
        } else {
            router.push(constant.routes.signIn);
        }
    };

    return (
        <ErrorBoundary>
            <div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center'>
                <h1 className='text-5xl font-bold mb-4'>{constant.label.pageNotFound}</h1>
                <p className='text-lg mb-8'>{constant.label.notExist}</p>
                <Button type='primary' onClick={handleGoBackHome}>
                    {constant.label.backToHome}
                </Button>
            </div>
        </ErrorBoundary>
    );
};

export default NotFound;