import constant from '../utils/constant';
import { refreshAccessToken } from '../utils/tokenServices';
const refreshtoken = localStorage.getItem(constant.localStorageKeys.refreshToken);
const id = localStorage.getItem(constant.localStorageKeys.userId);

export const apiService = async (payload, keys) => {
    try {

        let response = await apiCalls(payload, keys);

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else if (response.status === 401 && data.unauthorized) {
            return await refreshAccessToken(refreshtoken, id);
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        return { success: false, message: constant.general.serverError };
    }
};

export const apiCalls = async (payload, keys) => {
    let response;
    if (keys === constant.apiLabel.signin) {
        response = await fetch(`${process.env.REACT_APP_APIURL}/auth/signin`, {
            method: constant.apiMethod.POST,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } else if (keys === constant.apiLabel.signup) {
        response = await fetch(`${process.env.REACT_APP_APIURL}/user`, {
            method: constant.apiMethod.POST,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } else if (keys === constant.apiLabel.logout) {
        const { accesstoken, userId, refreshToken } = payload
        response = await fetch(`${process.env.REACT_APP_APIURL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accesstoken,
                refreshToken,
                id: userId,
            },
        });
    } else if (keys === constant.apiLabel.recipelist) {
        const { page, query, rating, prepTime, cookTime, accesstoken, userId } = payload;
        response = await fetch(`${process.env.REACT_APP_APIURL}/recipe?page=${page}${query ? '' : '&limit=20'}&searchKey=${query}&ratingValue=${rating}&preparationTime=${prepTime}&cookingTime=${cookTime}`, {
            method: constant.apiMethod.GET,
            headers: {
                'Content-Type': 'application/json',
                accesstoken,
                id: userId,
            },
        });
    } else if (keys === constant.apiLabel.myRecipe) {
        const { page, query, rating, prepTime, cookTime, accesstoken, userId, location } = payload;

        let url = location === constant.label.myRecipe ? 
        `${process.env.REACT_APP_APIURL}/recipe?limit=20&creator=${userId}&page=${page}&searchKey=${query}&ratingValue=${rating}&preparationTime=${prepTime}&cookingTime=${cookTime}` : 
        `${process.env.REACT_APP_APIURL}/favorites?limit=20&page=${page}&searchKey=${query}&ratingValue=${rating}&preparationTime=${prepTime}&cookingTime=${cookTime}`

        response = await fetch(url, {
            method: constant.apiMethod.GET,
            headers: {
                'Content-Type': 'application/json',
                accesstoken,
                id: userId,
            },
        });
    } else if (keys === constant.apiLabel.oneRecipe) {
        const { id, accesstoken, userId } = payload;
        response = await fetch(`${process.env.REACT_APP_APIURL}/recipe?_id=${id}`, {
            method: constant.apiMethod.GET,
            headers: {
                'Content-Type': 'application/json',
                accesstoken,
                id: userId,
            },
        });
    } else if (keys === constant.apiLabel.addRating) {
        const { accesstoken, userId } = payload
        response = await fetch(`${process.env.REACT_APP_APIURL}/recipefeedback`, {
            method: constant.apiMethod.POST,
            headers: {
                'Content-Type': 'application/json',
                accesstoken,
                id: userId,
            },
            body: JSON.stringify(payload),
        });
    } else if (keys === constant.apiLabel.savedRecipe) {
        const { recipeId, add, accesstoken, userId } = payload;
        response = await fetch(`${process.env.REACT_APP_APIURL}/user?recipeId=${recipeId}&add=${add}`, {
            method: constant.apiMethod.GET,
            headers: {
                'Content-Type': 'application/json',
                accesstoken,
                id: userId,
            }
        });
    } else if (keys === constant.apiLabel.forgotPassword) {
        response = await fetch(`${process.env.REACT_APP_APIURL}/password/sendEmail`, {
            method: constant.apiMethod.POST,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } else if (keys === constant.apiLabel.passwordConfirmation) {
        response = await fetch(`${process.env.REACT_APP_APIURL}/password/verify`, {
            method: constant.apiMethod.POST,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } else if (keys === constant.apiLabel.followClick) {
        const { accesstoken, userId } = payload;
        response = await fetch(`${process.env.REACT_APP_APIURL}/follow`, {
            method: constant.apiMethod.POST,
            headers: {
                'Content-Type': 'application/json',
                accesstoken,
                id: userId,
            },
            body: JSON.stringify(payload)
        });
    } else if (keys === constant.apiLabel.userProfile) {
        const { accesstoken, userId, page, searchKey, pathMap } = payload;
        const pathMapQuery = new URLSearchParams(pathMap).toString();
        response = await fetch(`${process.env.REACT_APP_APIURL}/user?${pathMapQuery}&limit=20&page=${page}&searchKey=${searchKey}`, {
            method: constant.apiMethod.GET,
            headers: {
                'Content-Type': 'application/json',
                accesstoken,
                id: userId,
            }
        });
    } else if (keys === constant.apiLabel.recipeImage) {
        response = await fetch(`${process.env.REACT_APP_APIURL}/getS3Url`, {
            method: constant.apiMethod.POST,
            body: payload
        });
    } else if (keys === constant.apiLabel.addRecipe) {
        const { accesstoken, userId } = payload;
        response = await fetch(`${process.env.REACT_APP_APIURL}/recipe`, {
            method: constant.apiMethod.POST,
            headers: {
                'Content-Type': 'application/json',
                accesstoken,
                id: userId,
            },
            body: JSON.stringify(payload)
        });
    } else if (keys === constant.apiLabel.oneUser) {
        const { accesstoken, userId } = payload;
        response = await fetch(`${process.env.REACT_APP_APIURL}/user?_id=${userId}`, {
            method: constant.apiMethod.GET,
            headers: {
                'Content-Type': 'application/json',
                accesstoken,
                id: userId,
            },
        });
    } else if (keys === constant.apiLabel.updateUserProfile) {
        const { accesstoken, userId } = payload;
        response = await fetch(`${process.env.REACT_APP_APIURL}/update`, {
            method: constant.apiMethod.PUT,
            headers: {
                'Content-Type': 'application/json',
                accesstoken,
                id: userId,
            },
            body: JSON.stringify(payload),
        });
    } else if (keys === constant.apiLabel.message) {
        const { accesstoken, userId } = payload;
        response = await fetch(`${process.env.REACT_APP_APIURL}/send`, {
            method: constant.apiMethod.POST,
            headers: {
                'Content-Type': 'application/json',
                accesstoken,
                id: userId,
            },
            body: JSON.stringify(payload),
        });
    } else if (keys === constant.apiLabel.getChat) {
        const { accesstoken, userId, sender, receiver } = payload;
        response = await fetch(`${process.env.REACT_APP_APIURL}/chat/${sender}/${receiver}`, {
            method: constant.apiMethod.GET,
            headers: {
                'Content-Type': 'application/json',
                accesstoken,
                id: userId,
            },
        });
    }
    return response;
};