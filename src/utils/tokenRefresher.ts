import axios from 'axios';
import constant from './constant';
import { useRouter } from 'next/router';
import { RefreshTokenResponseProps, RefreshAccessTokenParamsProps } from '../types/types';

/**
 * Function to refresh the access token using a refresh token.
 * It sends a POST request to the API with the refresh token and user ID.
 * On success, it updates the access token in local storage.
 * If the user is logged out or signout is true, it clears the local storage and redirects to the sign-in page.
 * 
 * @param {RefreshAccessTokenParamsProps} params - Contains the refresh token and user ID.
 * @returns {Promise<{ success: boolean; data?: any; message?: string }>} A promise that resolves to an object with success status and token data or error message.
 */
export const refreshAccessToken = async ({
    refreshToken,
    userId,
}: RefreshAccessTokenParamsProps): Promise<{ success: boolean; data?: any; message?: string }> => {
    const router = useRouter();

    try {
        const response = await axios.post<RefreshTokenResponseProps>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refreshtoken`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    refreshtoken: refreshToken,
                    id: userId,
                },
            }
        );

        const { data, status } = response;

        if (status === constant.statusCode.unAuthorized && (data.logout || data.signout)) {
            clearLocalStorage();
            router.push(constant.routes.signIn);
            return { success: false, message: 'User logged out' };
        } else if (status === constant.statusCode.success) {
            constant.localStorageUtils.setItem(constant.localStorageKeys.accessToken, data.accessToken);
            return { success: true, data: data.accessToken };
        }
        return { success: false, message: 'Unexpected status code' };
    } catch (error) {
        return { success: false, message: 'Error refreshing token' };
    }
};

/**
 * Clears all the relevant user data from local storage.
 * This includes access token, refresh token, user ID, and user name.
 */
export const clearLocalStorage = (): void => {
    localStorage.removeItem(constant.localStorageKeys.accessToken);
    localStorage.removeItem(constant.localStorageKeys.refreshToken);
    localStorage.removeItem(constant.localStorageKeys.userId);
    localStorage.removeItem(constant.localStorageKeys.userName);
};
