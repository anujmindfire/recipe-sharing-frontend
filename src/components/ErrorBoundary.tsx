import React, { Component, ErrorInfo } from 'react';
import { ErrorBoundaryProps, ErrorBoundaryState } from '../types/types';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import constant from '../utils/constant';
import logger from '../utils/logger';

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: undefined };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logger.error('Error caught in ErrorBoundary:', {
            message: error.message,
            stack: error.stack,
            errorInfo: errorInfo.componentStack,
        });
    }

    renderErrorPage = () => {
        const router = useRouter();

        const handleGoBackHome = () => {
            router.push(constant.routes.signIn);
        };

        return (
            <div className='flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center'>
                <h1 className='text-5xl font-bold mb-4'>{constant.general.somethingWentWrong}</h1>
                <p className='text-lg mb-8'>{this.state.error?.message || constant.general.serverError}</p>
                <Button type='primary' onClick={handleGoBackHome}>
                    {constant.label.backToHome}
                </Button>
            </div>
        );
    };

    render() {
        if (this.state.hasError) {
            return this.renderErrorPage();
        }

        return this.props.children;
    }
}

export default ErrorBoundary;