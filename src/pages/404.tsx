import React from 'react';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import ErrorBoundary from '../components/ErrorBoundary';
import constant from '../utils/constant';

const NotFound = () => {
    const router = useRouter();

    const handleGoBackHome = () => {
        router.push(constant.routes.signIn);
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
