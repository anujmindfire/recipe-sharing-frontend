import { configureStore } from '@reduxjs/toolkit';
import signInReducer from '../context/signInSlice';
import signUpReducer from '../context/signUpSlice';
import forgotPasswordReducer from '../context/forgotPasswordSlice';
import passwordConfirmReducer from '../context/passwordConfirmSlice';
import otpVerifyReducer from '../context/otpSlice';
import recipeListReducer from '../context/recpieListSlice';
import recipeDetailsReducer from '../context/recipeDetailsSlice';
import addRecipeReducer from '../context/appRecipeSlice';
import profileListReducer from '../context/profileListSlice';
import editProfileReducer from '../context/editProfileSlice';
import messageReducer from '../context/messageSlice';
import { ThunkAction, Action } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        signIn: signInReducer,
        signUp: signUpReducer,
        forgotPassword: forgotPasswordReducer,
        passwordConfirmation: passwordConfirmReducer,
        otpVerify: otpVerifyReducer,
        recipeList: recipeListReducer,
        recipeDetails: recipeDetailsReducer,
        addRecipe: addRecipeReducer,
        profileList: profileListReducer,
        editProfile: editProfileReducer,
        message: messageReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['messageSlice/setMessage'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export default store;
