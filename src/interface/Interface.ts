import { ReactNode } from 'react';

export interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    type?: 'submit' | 'button' | 'reset'; 
    className?: string;
    loading?: boolean;
    tabIndex?: number;
}   

export interface ErrorBoundaryProps {
    children: ReactNode;
}

export interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export interface ErrorModalProps {
    message: string;
    onClose: () => void;
}

export interface InputFieldProps {
    id: string;
    label?: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    name: string;
    disabled?: boolean;
    placeholder?: string;
    tabIndex: number;
}

export interface ValidationProps {
    error?: string;
    show: boolean;
}


export interface NotificationProps {
    title: string;
    message: string;
}

export interface HeaderProps {
    isLoggedIn: boolean;
    showDropdown: boolean;
    name: string;
    loading: boolean;
    errorMessage: string;
    showErrorModal: boolean;
}

export interface NotificationCompProps {
    isOpen: boolean;
    onClose: () => void;
    initialNotifications?: Array<{ title: string; message: string }>;
    onDeleteNotification: (index: number) => void;
}

export interface SearchProps {
    searchParams: { [key: string]: string };
    page: number;
    recipes: any[];
    allUniquePrepTimes: string[];
    allUniqueCookTimes: string[];
    notFound: boolean;
    [key: string]: any;
}

export interface RefreshTokenResponseProps {
    accessToken: string;
    logout?: boolean;
    signout?: boolean;
}

export interface RefreshAccessTokenParamsProps {
    refreshToken: string | null;
    userId: string | null;
}

export interface DynamicFormData<T = string> {
    [key: string]: T;
}

export interface FormDataProps {
    values: DynamicFormData;
    errors: DynamicFormData;
    loading: boolean;
    errorMessage: string;
}

export interface AuthState {
    accessToken: string | null;
}

export interface Payload {
    [key: string]: any;
}

export interface ApiError {
    message: string;
}

export interface SignInProps {
    values: {
        email: string;
        password: string;
    };
    errors: {
        email: string;
        password: string;
    };
    loading: boolean;
    errorMessage: string;
}

export interface SignUpProps {
    values: {
        name: string;
        email: string;
        password: string;
    };
    errors: {
        name: string;
        email: string;
        password: string;
    };
    loading: boolean;
    errorMessage: string;
}

export interface ForgotPasswordProps {
    values: {
        email: string
    }
    errors: {
        email: string;
    };
    loading: boolean;
    errorMessage: string;
    showSnackbar: boolean;
    successMessage: string;
}

export interface PasswordConfirmationProps {
    values: {
        password: string;
        confirmPassword: string;
    };
    errors: {
        password: string;
        confirmPassword: string;
    };
    loading: boolean;
    errorMessage: string;
    showSnackbar: boolean;
    successMessage: string;
}

export interface OtpProps {
    otp: string[];
    loading: boolean;
    errorMessage: string;
    successMessage: string;
    showSnackbar: boolean;
    resendTimer: number;
    isResendDisabled: boolean;
    isInputDisabled: boolean;
}

export interface RecipeProps {
    _id: string;
    title: string;
    imageUrl: string;
    averageRating: number;
    totalRating: number;
}

export interface RecipeCardProps {
    recipes: RecipeProps[];
}

export interface SearchFilterBarProps {
    searchParams: { [key: string]: string | number };
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string | number } }) => void;
    uniquePrepTimes: string[];
    uniqueCookTimes: string[];
    placeholder: string;
}

export interface SearchParamsProps {
    [key: string]: string | number | undefined;
}

export interface RecipeListProps {
    recipes: any[];
    totalPages: number;
    page: number;
    loading: boolean;
    allUniquePrepTimes: string[];
    allUniqueCookTimes: string[];
    errorMessage: string;
    showErrorModal: boolean;
    searchParams: SearchParamsProps;
    notFound: boolean;
}

export interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipeTitle: string;
    recipeLink: string;
}

export interface RecipeOneProps {
    imageUrl: string;
    title: string;
    description: string;
    preparationTime: string;
    cookingTime: string;
    ingredients: string[];
    steps: string[];
}

export interface FeedbackFormProps {
    userId: { name: string };
    createdAt: string;
    ratingValue: number;
    commentText: string;
}

export interface RecipeDetailsProps {
    recipe: RecipeOneProps;
    averageRating: number;
    totalRating: number;
    ratingPercentages: Record<string, number>;
    feedbackData: FeedbackFormProps[];
}

export interface RecipeState {
    recipe: RecipeDetailsProps | null;
    feedbackRating: number;
    feedbackComment: string;
    isLiked: boolean;
    loading: boolean;
    errorMessage: string | null;
    notFound: boolean;
    shareModalOpen: boolean;
    showErrorModal: boolean;
}

export interface MenuItem {
    icon: string;
    label: string;
    path: string;
}

export interface ProfileLayoutProps {
    children: React.ReactNode;
}

export interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export interface AddRecipeProps {
    values: {
        recipeTitle: string;
        ingredients: string;
        preparationSteps: string;
        description: string;
        preparationTime: string;
        cookingTime: string;
        imageUrl: string;
    };
    errors: {
        recipeTitle: string;
        ingredients: string;
        preparationSteps: string;
        preparationTime: string;
        cookingTime: string;
        imageUrl: string;
    };
    loading: boolean;
    errorMessage: string;
    successMessage: string;
    showSnackbar: boolean;
    imageUploadSuccess: boolean;
}