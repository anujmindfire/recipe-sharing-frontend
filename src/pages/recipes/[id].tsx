import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setRecipe, setLikeStatus, setLoading, setErrorMessage, toggleShareModal, setShowErrorModal, setNotFound, setFeedbackRating, setFeedbackComment } from '../../store/context/recipeDetailsSlice';
import { RootState } from '../../store/redux/store';
import { HeartOutlined, HeartFilled, ShareAltOutlined, LeftOutlined } from '@ant-design/icons';
import { apiService } from '../../apiService/service';
import { handleModalClose } from '../../utils/commonFunction';
import ErrorBoundary from '../../components/ErrorBoundary';
import Button from '../../components/Button';
import Validation from '../../components/Validation';
import Loader from '../../components/Loader';
import ShareModal from '../../components/ShareModal';
import ErrorModal from '../../components/ErrorModal';
import authenicateRoute from '../../utils/authenticatedRouteGuard';
import constant from '../../utils/constant';

const RecipeDetailsPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const dispatch = useDispatch();
    const recipeDetails = useSelector((state: RootState) => state.recipeDetails);

    const accesstoken = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.accessToken) : null;
    const userId = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.userId) : null;

    const fetchRecipeDetails = useCallback(async () => {
        if (!id) return;

        dispatch(setLoading(true));

        const payload = { id, accesstoken, userId };
        const result = await apiService(payload, constant.apiLabel.oneRecipe);

        if (result.success) {
            dispatch(setRecipe(result.data.data));
            dispatch(setLikeStatus(result.data.data.isSaved));
            dispatch(setLoading(false));
        } else {
            dispatch(setNotFound(true));
            dispatch(setErrorMessage(result.message));
            dispatch(setShowErrorModal(true));
            dispatch(setLoading(false));
        }
    }, [id, accesstoken, userId, dispatch]);

    useEffect(() => {
        fetchRecipeDetails();
    }, [fetchRecipeDetails]);

    const handleFeedbackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(setLoading(true));

        if (recipeDetails.feedbackRating === 0 || recipeDetails.feedbackComment.trim() === '') {
            dispatch(setErrorMessage(constant.validationMessage.invalidFeedback));
            dispatch(setLoading(false));
            return;
        }

        const payload = {
            recipeId: id,
            ratingValue: recipeDetails.feedbackRating,
            commentText: recipeDetails.feedbackComment,
            accesstoken,
            userId
        };
        const result = await apiService(payload, constant.apiLabel.addRating);
        if (result.success) {
            window.location.reload();
        } else {
            dispatch(setErrorMessage(result.message))
        }
        dispatch(setLoading(false));
    };

    const handleShareRecipe = () => {
        dispatch(toggleShareModal(true));
    };

    const toggleLike = async () => {
        const newLikeStatus = !recipeDetails.isLiked;
        dispatch(setLikeStatus(newLikeStatus));
        dispatch(setLoading(true));

        const payload = {
            recipeId: id,
            add: newLikeStatus,
            accesstoken,
            userId
        };
        const result = await apiService(payload, constant.apiLabel.savedRecipe);
        if (result.success) {
            dispatch(setLikeStatus(newLikeStatus));
        } else {
            dispatch(setErrorMessage(result.message));
        }
        dispatch(setLoading(false));
    };

    const handleErrorModalClose = () => handleModalClose(dispatch);

    return (
        <ErrorBoundary>
            <main className='bg-gray-800 min-h-screen flex flex-col overflow-hidden'>
                {recipeDetails.loading && !recipeDetails.notFound && <Loader />}
                {recipeDetails.notFound && <p className='text-yellow-300'>{constant.label.noRecipeFound}</p>}
                {recipeDetails.showErrorModal && <ErrorModal message={recipeDetails.errorMessage || 'An error occurred'} onClose={handleErrorModalClose} />}
                {recipeDetails.recipe && !recipeDetails.loading && (
                    <>
                        <article className='flex flex-col p-5 md:p-10 max-w-3xl mx-auto mt-2'>
                            <section className='font-bold text-2xl text-white my-12'>
                                <LeftOutlined
                                    onClick={() => router.back()}
                                    className='cursor-pointer text-white ml-5'
                                />
                                <figure className='p-4 mb-5'>
                                    <img src={recipeDetails.recipe?.recipe?.imageUrl} alt={recipeDetails.recipe?.recipe?.title} className='w-full rounded-lg aspect-video object-cover' />
                                </figure>
                                <div className='flex flex-col items-start mt-[-20px] px-5 relative'>
                                    <h2 className='min-h-[60px] text-white py-5 text-2xl font-bold'>
                                        {recipeDetails.recipe?.recipe?.title}
                                    </h2>
                                    <div className='flex gap-2 mt-2 absolute right-5 top-0 text-white'>
                                        {recipeDetails.isLiked ? (
                                            <HeartFilled
                                                className='cursor-pointer text-black'
                                                onClick={toggleLike}
                                            />
                                        ) : (
                                            <HeartOutlined
                                                className='cursor-pointer'
                                                onClick={toggleLike}
                                            />
                                        )}
                                        <ShareAltOutlined
                                            onClick={handleShareRecipe}
                                            className='cursor-pointer'
                                        />
                                    </div>
                                </div>
                                <p className='text-yellow-300 px-4 py-2'>{recipeDetails.recipe?.recipe?.description}</p>
                                <div className='flex gap-6 px-4 py-4 text-gray-200'>
                                    <div className='border-t border-gray-600 pt-5'>
                                        <h3 className='text-yellow-300 mb-2'>{constant.label.prepationTime}</h3>
                                        <p>{recipeDetails.recipe?.recipe?.preparationTime}</p>
                                    </div>
                                    <div className='border-t border-gray-600 pt-5'>
                                        <h3 className='text-yellow-300 mb-2'>{constant.label.cookingTime}</h3>
                                        <p>{recipeDetails.recipe?.recipe?.cookingTime}</p>
                                    </div>
                                </div>
                            </section>

                            <section className='p-4'>
                                <h3 className='text-yellow-300 mb-2'>{constant.label.ingredients}</h3>
                                <ul className='text-gray-200 list-disc list-inside'>
                                    {recipeDetails.recipe?.recipe?.ingredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient}</li>
                                    ))}
                                </ul>
                            </section>

                            <section className='p-4'>
                                <h3 className='text-yellow-300 mb-2'>{constant.label.steps}</h3>
                                {recipeDetails.recipe?.recipe?.steps.map((step, index) => (
                                    <div key={index} className='border-t border-gray-600 pt-5'>
                                        <h4 className='text-yellow-300'>{constant.label.step} {index + 1}</h4>
                                        <p className='text-gray-200'>{step}</p>
                                    </div>
                                ))}
                            </section>

                            <section className='flex gap-8 p-4 flex-wrap'>
                                <div className='min-w-[240px]'>
                                    <h3 className='text-4xl font-extrabold text-white mb-2'>{recipeDetails.recipe.averageRating}</h3>
                                    <div className='flex gap-1 mb-2'>
                                        {[...Array(5)].map((_, starIndex) => (
                                            <span key={starIndex} className='text-yellow-400 text-xl'>
                                                {starIndex < Math.round(recipeDetails.recipe?.averageRating ?? 0) ? '★' : '☆'}
                                            </span>
                                        ))}
                                    </div>
                                    <p className='text-gray-200 text-lg'>{recipeDetails.recipe.totalRating} {constant.label.review}</p>
                                </div>
                                <div className='flex-1 min-w-[200px] max-w-[400px]'>
                                    {Array.from({ length: 5 }, (_, index) => {
                                        const ratingKey = `rating${5 - index}`;
                                        const ratingPercentage = recipeDetails.recipe?.ratingPercentages[ratingKey] ?? 0;

                                        return (
                                            <div key={index} className='flex items-center mb-3'>
                                                <span className='text-gray-200 w-5'>{5 - index}</span>
                                                <div className='flex-1 h-2 bg-gray-700 rounded'>
                                                    <div
                                                        className='h-full bg-green-600 rounded'
                                                        style={{ width: `${ratingPercentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className='text-yellow-300 w-10 text-right'>{ratingPercentage}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Feedback Form Section */}
                            <section className='p-4'>
                                <h3 className='text-yellow-300 mb-2'>{constant.label.leaveComment}</h3>
                                <form onSubmit={handleFeedbackSubmit} className='flex flex-col'>
                                    <div className='flex gap-2 mb-4'>
                                        {[...Array(5)].map((_, starIndex) => (
                                            <span
                                                key={starIndex}
                                                className={`text-yellow-400 cursor-pointer text-2xl`}
                                                onClick={() => dispatch(setFeedbackRating(starIndex + 1))}
                                            >
                                                {starIndex < recipeDetails.feedbackRating ? '★' : '☆'}
                                            </span>
                                        ))}
                                    </div>
                                    <textarea
                                        className='p-2 rounded-md border border-gray-600 bg-gray-700 text-gray-200 mb-2'
                                        placeholder={constant.label.feedbackPlaceholder}
                                        value={recipeDetails.feedbackComment}
                                        onChange={(e) => dispatch(setFeedbackComment(e.target.value))}
                                    />
                                    {recipeDetails.errorMessage && (
                                        <div className='mb-2'>
                                            <Validation error={recipeDetails.errorMessage} show={true} />
                                        </div>
                                    )}
                                    <Button type='submit' loading={recipeDetails.loading} className='bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded'>
                                        {constant.label.submit}
                                    </Button>
                                </form>
                            </section>

                            {/* Reviews Section */}
                            <section className='p-4'>
                                <h3 className='text-yellow-300 mb-2'>{constant.label.reviews}</h3>
                                {recipeDetails.recipe?.feedbackData?.length > 0 ? (
                                    recipeDetails.recipe.feedbackData.map((feedback, index) => (
                                        <article key={index} className='mb-8'>
                                            <div className='flex items-center mb-2'>
                                                <div className='w-10 h-10 rounded-full bg-green-600 text-white flex justify-center items-center text-lg font-bold mr-3'>
                                                    {feedback.userId.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className='text-white'>{feedback.userId.name}</h3>
                                                    <time className='text-gray-400'>{new Date(feedback.createdAt).toLocaleDateString()}</time>
                                                </div>
                                            </div>
                                            <div className='flex mb-2'>
                                                {[...Array(5)].map((_, starIndex) => (
                                                    <span key={starIndex} className='text-yellow-400 text-xl'>
                                                        {starIndex < feedback.ratingValue ? '★' : '☆'}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className='text-gray-200'>{feedback.commentText}</p>
                                        </article>
                                    ))
                                ) : (
                                    <p className='text-white'>{constant.label.noReview}</p>
                                )}
                            </section>

                        </article>

                        {recipeDetails.shareModalOpen && (
                            <ShareModal
                                isOpen={recipeDetails.shareModalOpen}
                                onClose={() => dispatch(toggleShareModal(false))}
                                recipeTitle={recipeDetails.recipe?.recipe?.title}
                                recipeLink={window.location.href}
                            />
                        )}
                    </>
                )}
            </main>
        </ErrorBoundary>
    );
};

export default authenicateRoute(RecipeDetailsPage);
