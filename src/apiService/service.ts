import { Payload, ApiError } from '../interface/Interface';
import axios, { AxiosError } from 'axios';
import { refreshAccessToken } from '../utils/tokenRefresher';
import constant from '../utils/constant';

type ApiServiceResponse =
    | { success: true; data: any }
    | { success: false; message: string };

export const apiService = async (payload: Payload, keys: string): Promise<ApiServiceResponse> => {
    try {
        const response = await apiCalls(payload, keys);

        if (response.status === constant.statusCode.success) {
            return { success: true, data: response.data };
        } else if (response.status === constant.statusCode.unAuthorized && response.data.unauthorized) {
            const refreshResponse = await refreshAccessToken({
                refreshToken: constant.localStorageUtils.getItem(constant.localStorageKeys.refreshToken),
                userId: constant.localStorageUtils.getItem(constant.localStorageKeys.userId),
            });

            if (refreshResponse && refreshResponse.success) {
                return { success: true, data: refreshResponse.data };
            } else {
                return { success: false, message: refreshResponse?.message || 'Failed to refresh token' };
            }
        } else {
            return { success: false, message: response.data.message };
        }
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        const message = axiosError.response
            ? axiosError.response.data.message
            : constant.general.serverError;

        return { success: false, message };
    }
};

export const apiCalls = async (payload: Payload, keys: string) => {
    let url;
    const headers = {
        'Content-Type': 'application/json',
        accesstoken: localStorage.getItem(constant.localStorageKeys.accessToken),
        id: localStorage.getItem(constant.localStorageKeys.userId),
    };

    switch (keys) {
        case constant.apiLabel.signin:
            url = `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`;
            return await axios.post(url, payload, { headers });

        case constant.apiLabel.otpVerify:
            url = `${process.env.NEXT_PUBLIC_API_URL}/verify`;
            return await axios.post(url, payload, { headers });

        case constant.apiLabel.otpResend:
            url = `${process.env.NEXT_PUBLIC_API_URL}/resend`;
            return await axios.post(url, payload, { headers });

        case constant.apiLabel.signup:
            url = `${process.env.NEXT_PUBLIC_API_URL}/user`;
            return await axios.post(url, payload, { headers });

        case constant.apiLabel.logout:
            url = `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`;
            return await axios.post(url, payload, { headers });

        case constant.apiLabel.recipelist:
            url = `${process.env.NEXT_PUBLIC_API_URL}/recipe?page=${payload.page}&searchKey=${payload.query || '&limit=20'}&ratingValue=${payload.rating}&preparationTime=${payload.prepTime}&cookingTime=${payload.cookTime}`;
            return await axios.get(url, { headers });

        case constant.apiLabel.myRecipe:
            url = payload.location === constant.label.myRecipe
                ? `${process.env.NEXT_PUBLIC_API_URL}/recipe?limit=20&creator=${payload.userId}&page=${payload.page}&searchKey=${payload.query}&ratingValue=${payload.rating}&preparationTime=${payload.prepTime}&cookingTime=${payload.cookTime}`
                : `${process.env.NEXT_PUBLIC_API_URL}/favorites?limit=20&page=${payload.page}&searchKey=${payload.query}&ratingValue=${payload.rating}&preparationTime=${payload.prepTime}&cookingTime=${payload.cookTime}`;
            return await axios.get(url, { headers });

        case constant.apiLabel.oneRecipe:
            url = `${process.env.NEXT_PUBLIC_API_URL}/recipe?_id=${payload.id}`;
            return await axios.get(url, { headers });

        case constant.apiLabel.addRating:
            url = `${process.env.NEXT_PUBLIC_API_URL}/recipefeedback`;
            return await axios.post(url, payload, { headers });

        case constant.apiLabel.savedRecipe:
            url = `${process.env.NEXT_PUBLIC_API_URL}/user?recipeId=${payload.recipeId}&add=${payload.add}`;
            return await axios.get(url, { headers });

        case constant.apiLabel.forgotPassword:
            url = `${process.env.NEXT_PUBLIC_API_URL}/password/sendEmail`;
            return await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });

        case constant.apiLabel.passwordConfirmation:
            url = `${process.env.NEXT_PUBLIC_API_URL}/password/verify`;
            return await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });

        case constant.apiLabel.followClick:
            url = `${process.env.NEXT_PUBLIC_API_URL}/follow`;
            return await axios.post(url, payload, { headers });

        case constant.apiLabel.userProfile:
            url = `${process.env.NEXT_PUBLIC_API_URL}/user?${new URLSearchParams(payload.pathMap).toString()}&limit=20&page=${payload.page}&searchKey=${payload.searchKey}`;
            return await axios.get(url, { headers });

        case constant.apiLabel.recipeImage:
            url = `${process.env.NEXT_PUBLIC_API_URL}/getS3Url`;
            return await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });

        case constant.apiLabel.addRecipe:
            url = `${process.env.NEXT_PUBLIC_API_URL}/recipe`;
            return await axios.post(url, payload, { headers });

        case constant.apiLabel.oneUser:
            url = `${process.env.NEXT_PUBLIC_API_URL}/user?_id=${payload.userId}`;
            return await axios.get(url, { headers });

        case constant.apiLabel.updateUserProfile:
            url = `${process.env.NEXT_PUBLIC_API_URL}/update`;
            return await axios.put(url, payload, { headers });

        case constant.apiLabel.message:
            url = `${process.env.NEXT_PUBLIC_API_URL}/send`;
            return await axios.post(url, payload, { headers });

        case constant.apiLabel.getChat:
            url = `${process.env.NEXT_PUBLIC_API_URL}/chat/${payload.sender}/${payload.receiver}`;
            return await axios.get(url, { headers });

        default:
            throw new Error('Invalid API call');
    }
};