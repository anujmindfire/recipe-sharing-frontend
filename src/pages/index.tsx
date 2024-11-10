import React, { useEffect, Suspense, lazy } from 'react';
import { useRouter } from 'next/router';
import constant from '../utils/constant';
import Loader from '../components/Loader'
const SignIn = lazy(() => import('./signin'));
const SignUp = lazy(() => import('./signup'));
const OTPVerify = lazy(() => import('./otpverify'));
const ForgotPassword = lazy(() => import('./forgotpassword/index'));
const PasswordConfirmation = lazy(() => import('./forgotpassword/[txnId]'));
const RecipeList = lazy(() => import('./recipes/index'));
const RecipeDetails = lazy(() => import('./recipes/[id]'));
const MyRecipe = lazy(() => import('../pages/profile/recipes'));
const FavouriteRecipe = lazy(() => import('../pages/profile/favourites'));

const Index = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace(constant.routes.signIn);
    }, [router]);

    return (
        <Suspense fallback={<Loader />}>
            <SignIn />
            <SignUp />
            <OTPVerify />
            <ForgotPassword />
            <PasswordConfirmation />
            <RecipeList />
            <RecipeDetails />
            <MyRecipe />
            <FavouriteRecipe />
        </Suspense>
    );
};

export default Index;