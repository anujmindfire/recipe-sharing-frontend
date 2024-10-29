import axios from 'axios';
import constant from '../utils/constant.js';
import { refreshAccessToken } from '../utils/tokenServices.js';

const refreshtoken = localStorage.getItem(constant.localStorageKeys.refreshToken);
const id = localStorage.getItem(constant.localStorageKeys.userId);

export const apiService = async (payload, keys) => {
    try {
        let response = await apiCalls(payload, keys);

        if (response.status === constant.statusCode.success) {
            return { success: true, data: response.data };
        } else if (response.status === constant.statusCode.unAuthorized && response.data.unauthorized) {
            return await refreshAccessToken(refreshtoken, id);
        } else {
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        return { success: false, message: error.response ? error.response.data.message : constant.general.serverError };
    }
};

export const apiCalls = async (payload, keys) => {
    let url;
    const headers = {
        'Content-Type': 'application/json',
        accesstoken: localStorage.getItem(constant.localStorageKeys.accessToken),
        id: localStorage.getItem(constant.localStorageKeys.userId),
    };

    switch (keys) {
        case constant.apiLabel.signin:
            url = `${process.env.REACT_APP_APIURL}/auth/signin`;
            return await axios.post(url, payload, { headers });
        
        case constant.apiLabel.signup:
            url = `${process.env.REACT_APP_APIURL}/user`;
            return await axios.post(url, payload, { headers });

        case constant.apiLabel.logout:
            url = `${process.env.REACT_APP_APIURL}/auth/logout`;
            return await axios.post(url, payload, { headers });

        case constant.apiLabel.recipelist:
            url = `${process.env.REACT_APP_APIURL}/recipe?page=${payload.page}&searchKey=${payload.query || ''}&ratingValue=${payload.rating}&preparationTime=${payload.prepTime}&cookingTime=${payload.cookTime}`;
            return await axios.get(url, { headers });

        case constant.apiLabel.myRecipe:
            url = payload.location === constant.label.myRecipe 
                ? `${process.env.REACT_APP_APIURL}/recipe?limit=20&creator=${payload.userId}&page=${payload.page}&searchKey=${payload.query}&ratingValue=${payload.rating}&preparationTime=${payload.prepTime}&cookingTime=${payload.cookTime}` 
                : `${process.env.REACT_APP_APIURL}/favorites?limit=20&page=${payload.page}&searchKey=${payload.query}&ratingValue=${payload.rating}&preparationTime=${payload.prepTime}&cookingTime=${payload.cookTime}`;
            return await axios.get(url, { headers });

        case constant.apiLabel.oneRecipe:
            url = `${process.env.REACT_APP_APIURL}/recipe?_id=${payload.id}`;
            return await axios.get(url, { headers });

        case constant.apiLabel.addRating:
            url = `${process.env.REACT_APP_APIURL}/recipefeedback`;
            return await axios.post(url, payload, { headers });

        case constant.apiLabel.savedRecipe:
            url = `${process.env.REACT_APP_APIURL}/user?recipeId=${payload.recipeId}&add=${payload.add}`;
            return await axios.get(url, { headers });

        case constant.apiLabel.forgotPassword:
            url = `${process.env.REACT_APP_APIURL}/password/sendEmail`;
            return await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });

        case constant.apiLabel.passwordConfirmation:
            url = `${process.env.REACT_APP_APIURL}/password/verify`;
            return await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });

        case constant.apiLabel.followClick:
            url = `${process.env.REACT_APP_APIURL}/follow`;
            return await axios.post(url, payload, { headers });

        case constant.apiLabel.userProfile:
            url = `${process.env.REACT_APP_APIURL}/user?${new URLSearchParams(payload.pathMap).toString()}&limit=20&page=${payload.page}&searchKey=${payload.searchKey}`;
            return await axios.get(url, { headers });

        case constant.apiLabel.recipeImage:
            url = `${process.env.REACT_APP_APIURL}/getS3Url`;
            return await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });

        case constant.apiLabel.addRecipe:
            url = `${process.env.REACT_APP_APIURL}/recipe`;
            return await axios.post(url, payload, { headers });

        case constant.apiLabel.oneUser:
            url = `${process.env.REACT_APP_APIURL}/user?_id=${payload.userId}`;
            return await axios.get(url, { headers });

        case constant.apiLabel.updateUserProfile:
            url = `${process.env.REACT_APP_APIURL}/update`;
            return await axios.put(url, payload, { headers });

        case constant.apiLabel.message:
            url = `${process.env.REACT_APP_APIURL}/send`;
            return await axios.post(url, payload, { headers });

        case constant.apiLabel.getChat:
            url = `${process.env.REACT_APP_APIURL}/chat/${payload.sender}/${payload.receiver}`;
            return await axios.get(url, { headers });

        default:
            throw new Error('Invalid API call');
    }
};