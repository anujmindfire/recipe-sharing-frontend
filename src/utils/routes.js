import { lazy } from 'react';

// Lazy-loaded components
const SignUp = lazy(() => import('../pages/Signup'));
const OTP = lazy(() => import('../pages/OTP'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const PasswordConfirmation = lazy(() => import('../pages/PasswordConfirmation'));
const SignIn = lazy(() => import('../pages/Signin'));
const RecipeList = lazy(() => import('../pages/RecipeList'));
const RecipeDetailsPage = lazy(() => import('../pages/RecipeDetailsPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const AddRecipe = lazy(() => import('../pages/AddRecipe'));
const MyRecipes = lazy(() => import('../pages/MyRecipes'));
const ProfileList = lazy(() => import('../pages/ProfileList'));
const EditProfile = lazy(() => import('../pages/EditProfile'));
const ChatSidebar = lazy(() => import('../pages/ChatSidebar'));
const NotFound = lazy(() => import('../pages/NotFound'));

const routesConstant = {
    publicRoutes: [
        { path: '/', element: SignIn, name: 'SignIn' },
        { path: '/signup', element: SignUp, name: 'SignUp' },
        { path: '/otp-verify', element: OTP, name: 'OTP' },
        { path: '/forgot-password', element: ForgotPassword, name: 'ForgotPassword' },
        { path: '/forgot-password/:txnId', element: PasswordConfirmation, name: 'PasswordConfirmation' },
        { path: '/signin', element: SignIn, name: 'SignIn' },
        { path: '*', element: NotFound, name: 'NotFound' },
    ],
    privateRoutes: [
        { path: '/recipes', element: RecipeList, name: 'RecipeList' },
        { path: '/recipe/:id', element: RecipeDetailsPage, name: 'RecipeDetailsPage' },
        {
            path: '/profile', element: ProfilePage, name: 'ProfilePage', children: [
                { path: 'recipe/add', element: AddRecipe, name: 'AddRecipe' },
                { path: 'recipes', element: MyRecipes, name: 'MyRecipes' },
                { path: 'favourites', element: MyRecipes, name: 'Favourites' },
                { path: 'following', element: ProfileList, name: 'Following' },
                { path: 'follower', element: ProfileList, name: 'Follower' },
                { path: 'list', element: ProfileList, name: 'ProfileList' },
                { path: 'edit', element: EditProfile, name: 'EditProfile' },
                { path: 'chat', element: ChatSidebar, name: 'ChatSidebar' },
            ]
        }
    ],
};

export default routesConstant;
