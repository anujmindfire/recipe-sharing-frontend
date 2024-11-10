import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { setErrorMessage, setShowErrorModal } from '../store/context/recpieListSlice';
import constant from './constant';

// Helper function to parse a time string (e.g., "5 hours" -> 300)
const parseTimeString = (timeString: string): number => {
    const [value, unit] = timeString.split(' ');
    return unit.includes('hour') ? parseInt(value) * 60 : parseInt(value);
};

// Sort an array of times
const sortTimes = (times: string[]): string[] => {
    return times.sort((a, b) => parseTimeString(a) - parseTimeString(b));
};

// Close modal and reset message
const handleModalClose = (dispatch: any): void => {
    dispatch(setShowErrorModal(false));
    dispatch(setErrorMessage(''));
};

// Custom hook to clear local storage and redirect
const useClearLocalStorageAndRedirect = (redirectRoute: string) => {
    const router = useRouter();

    useEffect(() => {
        // Clear specific local storage items if the user is not on the sign-in page
        if (router.pathname !== constant.routes.signIn) {
            localStorage.removeItem(constant.localStorageKeys.email);
            localStorage.removeItem(constant.localStorageKeys.txnId);
        }

        // Check if access and refresh tokens are available
        if (
            constant.localStorageUtils.getItem(constant.localStorageKeys.accessToken) &&
            constant.localStorageUtils.getItem(constant.localStorageKeys.refreshToken)
        ) {
            // Redirect to the specified route
            router.push(redirectRoute);
        }
    }, [router, redirectRoute]);
};

export {
    sortTimes,
    handleModalClose,
    useClearLocalStorageAndRedirect
};
