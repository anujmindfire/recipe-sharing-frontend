import constant from './constant';

export const refreshAccessToken = async (refreshtoken, userId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_APIURL}/auth/refreshtoken`, {
            method: constant.apiMethod.POST,
            headers: {
                'Content-Type': 'application/json',
                refreshtoken,
                id: userId,
            },
        });

        const data = await response.json();

        if (!response.ok && response.status === constant.statusCode.unAuthorized && data.logout) {
            clearLocalStorage();
            window.location.href = constant.routes.signIn;
            return null;
        } else if (response.ok && response.status === constant.statusCode.success) {
            constant.localStorageUtils.setItem(constant.localStorageKeys.accessToken, data.accessToken);
            return data.accessToken;
        } else if (!response.ok && response.status === constant.statusCode.unAuthorized && data.signout) {
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