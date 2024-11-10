import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RecipeState, RecipeDetailsProps } from '../../interface/Interface';

const initialState: RecipeState = {
    recipe: null,
    feedbackRating: 0,
    feedbackComment: '',
    isLiked: false,
    loading: true,
    errorMessage: null,
    notFound: false,
    shareModalOpen: false,
    showErrorModal: false,
};

const recipeSlice = createSlice({
    name: 'recipeDetails',
    initialState,
    reducers: {
        setRecipe(state, action: PayloadAction<RecipeDetailsProps>) {
            state.recipe = action.payload;
        },
        setLikeStatus(state, action: PayloadAction<boolean>) {
            state.isLiked = action.payload;
        },
        toggleShareModal(state, action: PayloadAction<boolean>) {
            state.shareModalOpen = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setErrorMessage(state, action: PayloadAction<string>) {
            state.errorMessage = action.payload;
        },
        setShowErrorModal: (state, action: PayloadAction<boolean>) => {
            state.showErrorModal = action.payload;
        },
        setNotFound: (state, action: PayloadAction<boolean>) => {
            state.notFound = action.payload;
        },
        setFeedbackRating(state, action: PayloadAction<number>) {
            state.feedbackRating = action.payload;
        },
        setFeedbackComment(state, action: PayloadAction<string>) {
            state.feedbackComment = action.payload;
        }
    },
});

export const { setRecipe, setLikeStatus, toggleShareModal, setLoading, setErrorMessage, setShowErrorModal, setNotFound, setFeedbackRating, setFeedbackComment } = recipeSlice.actions;
export default recipeSlice.reducer;