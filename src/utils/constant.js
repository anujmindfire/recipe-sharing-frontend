const constant = {
    inputLabel: {
        name: {
            type: 'text',
            label: 'Full Name',
            id: 'name'
        },
        email: {
            type: 'email',
            label: 'Email'
        },
        password: {
            type: 'password',
            label: 'Password'
        },
        confirmPassword: {
            type: 'confirmPassword',
            label: 'Confirm Password'
        },
        recipeTitle: {
            id: 'recipeTitle',
            type: 'text',
            label: 'Recipe Title',
            placeholder: 'Enter the title of your recipe'
        },
        ingredients: {
            id: 'ingredients',
            type: 'textarea',
            label: 'Ingredients',
            placeholder: 'List your ingredients here with comma separate'
        },
        preparationSteps: {
            id: 'preparationSteps',
            type: 'textarea',
            label: 'Preparation Steps',
            placeholder: 'Describe the preparation steps with comma separate'
        },
        description: {
            id: 'description',
            type: 'textarea',
            label: 'Description',
            placeholder: 'Enter a description for the recipe'
        },
        preparationTime: {
            id: 'preparationTime',
            type: 'text',
            label: 'Preparation Time',
            placeholder: 'Enter preparation time'
        },
        cookingTime: {
            id: 'cookingTime',
            type: 'text',
            label: 'Cooking Time',
            placeholder: 'Enter cooking time'
        },
        imageUrl: {
            id: 'imageUrl',
            type: 'file',
            label: 'Upload Image',
            placeholder: 'Choose Image'
        },
        bio: {
            type: 'textarea',
            label: 'Bio',
            name: 'bio'
        },
        favouriteRecipe: {
            type: 'text',
            label: 'Favourite Recipe',
            name: 'favouriteRecipe'
        },
        messageInput: {
            type: 'text',
            id: 'messageInput',
            placeHolder: 'Type a message'
        }
    },
    label: {
        welcome: 'Welcome back',
        continue: 'Continue',
        forgotPassword: 'Forgot Password?',
        haveAccount: 'Don\'t have an account?',
        signup: 'Sign up',
        alreadyHaveAccount: 'Already have an account?',
        signIn: 'Sign In',
        createAccount: 'Create an Account',
        noRecipeFound: 'No recipes found',
        noProfileFound: 'No profiles found',
        prepationTime: 'Preparation Time',
        cookingTime: 'Cooking Time',
        rating: 'Ratings',
        ingredients: 'Ingredients',
        steps: 'Steps',
        step: 'Step',
        review: 'Review',
        reviews: 'Reviews',
        leaveComment: 'Leave a Review',
        feedbackPlaceholder: 'Write your feedback here...',
        submit: 'Submit',
        noReview: 'No reviews yet.',
        backRecipe: 'Back to Recipes',
        resetPassword: 'Reset your password?',
        rememberPassword: 'Remembered your password?',
        sendLink: 'Send Reset Link',
        pageNotFound: '404 - Page Not Found',
        notExist: 'The page you are looking for does not exist.',
        backToHome: 'Go Back to Home',
        resetPasswordLabel: 'Reset Password',
        updateProfile: 'Update Profile',
        errorModalHeading: 'Whoops!',
        closeLabel: 'Close',
        notification: 'Notifications',
        noAvailNoti: 'No notifications available.',
        deleteNoti: 'Delete Notification',
        addRecipe: 'Add Recipe',
        myRecipe: 'My Recipes',
        myFavo: 'My Favorites',
        following: 'Following',
        followers: 'Followers',
        editProfile: 'Edit Profile',
        users: 'Users',
        chat: 'Chat',
        logout: 'Logout',
        profile: 'Profile',
        recipes: 'Recipes',
        logoText: 'Foodies',
        connect: 'connect',
        join: 'join',
        noti: 'notification',
        followTitle: 'Follow',
        messageNoti: 'messageNotification',
        messageTitle: 'Message Notification',
        unfollow: 'Unfollow',
        followBack: 'Follow back',
        follow: 'Follow',
        hidden: 'hidden',
        auto: 'auto',
        imageUpload: 'Image successfully uploaded.',
        chooseImage: 'Choose Image',
        isRequired: 'is required',
        changeEmail: 'Go Back to Change Your Email',
        resendCode: 'Resend Code',
        havingCode: 'Having trouble receiving the code?',
        resendCodeIn: 'Resend code in',
        second: 'seconds.',
        verify: 'Verify',
        enterOtp: 'Enter OTP',
        digit: '2-digit',
        send: 'Send'
    },
    searchLabel: {
        recipe: 'Search Recipes...',
        user: 'Search Users...'
    },
    general: {
        serverError: 'Unable to connect to the server. Please check your internet connection.',
    },
    validationMessage: {
        invalidEmail: 'Please enter a valid email address.',
        invalidPassword: 'Password must be 8-50 characters long, with at least one number, uppercase letter, lowercase letter, and special character.',
        invalidConfirmPassword: 'Confirm Password must be same',
        invalidName: 'Name can only contain letters and spaces.',
        invalidLength: 'Name should be greater than 2 and less than 50 characters.',
        invalidFeedback: 'Please provide both a rating and a comment.',
        linkExpired: 'Link has expired',
        invalidImage: 'Invalid file type. Please select a JPEG or PNG image.',
        inValidOTP: 'Please enter all 6 digits',
        invalidDate: 'Invalid date'
    },
    routes: {
        signIn: '/signin',
        signUp: '/signup',
        recipes: '/recipes',
        forgotPassword: '/forgot-password',
        otpVerify: '/otp-verify',
        addRecipe: '/profile/recipe/add',
        myRecipe: '/profile/recipes',
        myFavo: '/profile/favourites',
        following: '/profile/following',
        followers: '/profile/follower',
        editProfile: '/profile/edit',
        users: '/profile/list',
        chat: '/profile/chat',
    },
    buttonType: {
        submit: 'submit',
        button: 'button'
    },
    localStorageKeys: {
        accessToken: 'accesstoken',
        refreshToken: 'refreshtoken',
        userId: 'id',
        userName: 'name',
        email: 'email',
        txnId: 'txnId',
        isLeavingPasswordPage: 'isLeavingPasswordPage',
        isLeavingPasswordPageValue: 1,
        isLeavingPasswordPageValue2: 2,
        isLeavingOTPPage: 'isLeavingOTPPage',
        selectedChatUserId: 'selectedChatUserId'
    },
    localStorageUtils: {
        setItem: (key, value) => localStorage.setItem(key, value),
        getItem: (key) => localStorage.getItem(key),
        removeItem: (key) => localStorage.removeItem(key),
        clear: () => localStorage.clear(),
    },
    apiLabel: {
        signin: 'signIn',
        signup: 'signUp',
        forgotPassword: 'forgotPassword',
        passwordConfirmation: 'passwordconfirmation',
        logout: 'logout',
        addRecipe: 'addrecipe',
        recipelist: 'recipeList',
        myRecipe: 'myrecipe',
        oneRecipe: 'onerecipe',
        addRating: 'addrating',
        savedRecipe: 'savedrecipe',
        followClick: 'followclick',
        userProfile: 'userProfile',
        recipeImage: 'recipeImage',
        oneUser: 'userone',
        updateUserProfile: 'updateProfile',
        message: 'message',
        getChat: 'getChat'
    },
    apiMethod: {
        POST: 'POST',
        GET: 'GET',
        PUT: 'PUT'
    },
    statusCode: {
        unAuthorized: 401,
        success: 200
    },
    dropdownKeys: {
        rating: 'rating',
        prepTime: 'prepTime',
        cookTime: 'cookTime'
    },
    imageLink: {
        loader: 'https://x.yummlystatic.com/web/spinner-dark-bg.gif',
        ratingsIcon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/55bdabcc3e4512c59afe449d9d1b546b517fd488685996453161f536af6ad420?placeholderIfAbsent=true&apiKey=2ac8b4a54abb47edaafca4375aaa23ca',
        prepTimeIcon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/7635bf000a4247eb5045ce4726f20b5360ab91f5e68ac9a31ef5c32e01d66453?placeholderIfAbsent=true&apiKey=2ac8b4a54abb47edaafca4375aaa23ca',
        cookTimeIcon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/62228860ee69f4142ec7e161453f90cc9bf9eceb969129ee603864326d91ef26?placeholderIfAbsent=true&apiKey=2ac8b4a54abb47edaafca4375aaa23ca',
        dropdownIcon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/ff486d73e470ae303168e1ba7d41e5871a99c7f00ee81628e738483cb9553e6b?placeholderIfAbsent=true&apiKey=2ac8b4a54abb47edaafca4375aaa23ca',
        addRecipe: 'https://cdn.builder.io/api/v1/image/assets/TEMP/802a7701aa4a6deb10457e7bb71e3430cbd4fbae7866a32daf0f8cfb9847f199?placeholderIfAbsent=true&apiKey=2ac8b4a54abb47edaafca4375aaa23ca',
        myRecipe: 'https://cdn.builder.io/api/v1/image/assets/TEMP/2beb0567234f2366a8a65cd6189ff27674bdd8caffff2735324e18eafa9d3472?placeholderIfAbsent=true&apiKey=2ac8b4a54abb47edaafca4375aaa23ca',
        myFavo: 'https://cdn.builder.io/api/v1/image/assets/TEMP/84b642dc96e9767f1e4c4cd9ba5ea89febffedbfeed6361c063455e162257e91?placeholderIfAbsent=true&apiKey=2ac8b4a54abb47edaafca4375aaa23ca',
        following: 'https://cdn.builder.io/api/v1/image/assets/TEMP/97548eaf18c713094b7cfc5d4136dcacee8b769f39ec2d9132a7eb865f56e738?placeholderIfAbsent=true&apiKey=2ac8b4a54abb47edaafca4375aaa23ca',
        followers: 'https://cdn.builder.io/api/v1/image/assets/TEMP/12ee3116cbb1bf8d6748ce3226b23c6b0c7c52e9b28bbcb6c693fdcd498c5b17?placeholderIfAbsent=true&apiKey=2ac8b4a54abb47edaafca4375aaa23ca',
        editProfile: 'https://cdn.builder.io/api/v1/image/assets/TEMP/aa00526d61739d74ce9f636d5bed7d5ed52880addcea0180cb5b313fa3f52292?placeholderIfAbsent=true&apiKey=2ac8b4a54abb47edaafca4375aaa23ca',
        users: 'https://cdn.builder.io/api/v1/image/assets/TEMP/41d8c039d9f44fce79557d896a66e29271cf60215b3b7146f0a65eb57baac2bf?placeholderIfAbsent=true&apiKey=2ac8b4a54abb47edaafca4375aaa23ca',
        chat: 'https://cdn.builder.io/api/v1/image/assets/TEMP/ee63cb9d8b486a245e2b1c1d627da1a6f507874c07af7e54d3198d9a2b01a421?placeholderIfAbsent=true&apiKey=2ac8b4a54abb47edaafca4375aaa23ca',
        notificationIcon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/d38291a9b11a8859d48e42f8f0acddefed86e9d4a9f526bdd03b4d73321cd8f7?placeholderIfAbsent=true&apiKey=2ac8b4a54abb47edaafca4375aaa23ca',
        logoIcon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/816ec92c75ce46d771dff7553ea02bf564ee67407d796a5c6d3243bd7a9efc0c?placeholderIfAbsent=true&apiKey=2ac8b4a54abb47edaafca4375aaa23ca',
        profileIcon: 'https://imgv3.fotor.com/images/blog-cover-image/10-profile-picture-ideas-to-make-you-stand-out.jpg',
        chatIcon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f8aa5864f4496088c34969bd03fb7653ad0f1755b36b6d1430a30d71f97c216b?placeholderIfAbsent=true&apiKey=2ac8b4a54abb47edaafca4375aaa23ca'
    },
    imageAlt: {
        loading: 'Loading...',
        dropdown: 'Dropdown',
        imageAlt: 'Foodie logo',
        chaticons: 'Chat icon'
    },
    imageType: {
        jpeg: 'image/jpeg',
        png: 'image/png',
        file: 'file',
        accept: 'image/*'
    }
};

export default constant;
