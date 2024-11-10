import { configureStore } from '@reduxjs/toolkit';
import signInReducer from '../context/signInSlice';
import signUpReducer from '../context/signUpSlice';
import forgotPasswordReducer from '../context/forgotPasswordSlice';
import passwordConfirmReducer from '../context/passwordConfirmSlice';
import otpVerifyReducer from '../context/otpSlice';
import recipeListReducer from '../context/recpieListSlice';
import recipeDetailsReducer from '../context/recipeDetailsSlice';
import addRecipeReducer from '../context/appRecipeSlice';

const store = configureStore({
    reducer: {
        signIn: signInReducer,
        signUp: signUpReducer,
        forgotPassword: forgotPasswordReducer,
        passwordConfirmation: passwordConfirmReducer,
        otpVerify: otpVerifyReducer,
        recipeList: recipeListReducer,
        recipeDetails: recipeDetailsReducer,
        addRecipe: addRecipeReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
