import axios from 'axios';
import constant from './constant.js';

export const refreshAccessToken = async (refreshtoken, userId) => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_APIURL}/auth/refreshtoken`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    refreshtoken,
                    id: userId,
                },
            }
        );

        const { data, status } = response;

        if (status === constant.statusCode.unAuthorized && data.logout) {
            clearLocalStorage();
            window.location.href = constant.routes.signIn;
            return null;
        } else if (status === constant.statusCode.success) {
            constant.localStorageUtils.setItem(constant.localStorageKeys.accessToken, data.accessToken);
            return data.accessToken;
        } else if (status === constant.statusCode.unAuthorized && data.signout) {
            clearLocalStorage();
            window.location.href = constant.routes.signIn;
            return null;
        }
    } catch (error) {
        return null;
    }
};

export const clearLocalStorage = () => {
    localStorage.removeItem(constant.localStorageKeys.accessToken);
    localStorage.removeItem(constant.localStorageKeys.refreshToken);
    localStorage.removeItem(constant.localStorageKeys.userId);
    localStorage.removeItem(constant.localStorageKeys.userName);
};