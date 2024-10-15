import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/RecipePage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as heartRegular, faHeart as heartSolid, faShareNodes as solidShare, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { backendURL } from '../api/url';
import Button from '../components/Button';
import Validation from '../components/Validation';
import Loader from '../components/Loader';
import ShareModal from '../components/ShareModal';
import withAuthentication from '../utils/withAuthenicate';
import { refreshAccessToken } from '../utils/tokenServices';

const RecipeDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [state, setState] = useState({
        recipe: null,
        feedbackRating: 0,
        feedbackComment: '',
        isLiked: false,
        isLoading: true,
        errorMessage: null,
        notFound: false,
        shareModalOpen: false,
    });

    const accesstoken = localStorage.getItem('accesstoken');
    const refreshtoken = localStorage.getItem('refreshtoken');
    const userId = localStorage.getItem('id');

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            setState((prev) => ({ ...prev, isLoading: true }));

            try {
                const response = await fetch(`${backendURL}/recipe?_id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        accesstoken,
                        id: userId,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setState((prev) => ({
                        ...prev,
                        recipe: data.data,
                        isLiked: data.data.isSaved,
                        isLoading: false
                    }));
                } else if (response.status === 401 || data.unauthorized) {
                    await refreshAccessToken(refreshtoken, userId, navigate);
                } else {
                    setState((prev) => ({
                        ...prev,
                        notFound: true,
                        errorMessage: data.message,
                        isLoading: false
                    }));
                }
            } catch (error) {
                setState((prev) => ({
                    ...prev,
                    errorMessage: 'Unable to connect to the server. Please check your internet connection.',
                    isLoading: false
                }));
            }
        };

        fetchRecipeDetails();
    }, [id, accesstoken, refreshtoken, userId, navigate]);

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setState((prev) => ({ ...prev, errorMessage: null }));

        if (state.feedbackRating === 0 || state.feedbackComment.trim() === '') {
            setState((prev) => ({ ...prev, errorMessage: 'Please provide both a rating and a comment.' }));
            return;
        }

        try {
            const response = await fetch(`${backendURL}/recipefeedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    accesstoken,
                    id: userId,
                },
                body: JSON.stringify({ recipeId: id, ratingValue: state.feedbackRating, commentText: state.feedbackComment }),
            });

            const data = await response.json();

            if (response.ok) {
                window.location.reload();
            } else if (data.message) {
                setState((prev) => ({ ...prev, errorMessage: data.message }));
            }
        } catch {
            setState((prev) => ({ ...prev, errorMessage: 'Something went wrong while submitting feedback.' }));
        }
    };

    const handleShareRecipe = () => {
        setState((prev) => ({ ...prev, shareModalOpen: true }));
    };

    const toggleLike = async () => {
        setState((prev) => ({ ...prev, isLoading: true }));
        try {
            const response = await fetch(`${backendURL}/user?recipeId=${id}&add=${!state.isLiked}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    accesstoken,
                    id: userId,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setState((prev) => ({ ...prev, isLiked: !prev.isLiked }));
            } else {
                setState((prev) => ({ ...prev, errorMessage: data.message }));
            }
        } catch {
            setState((prev) => ({ ...prev, errorMessage: 'Something went wrong while processing your request.' }));
        } finally {
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    };

    return (
        <main className={styles.recipeReview}>
            {state.isLoading && !state.notFound && <Loader />}
            {state.recipe && !state.isLoading && (
                <>
                    <article className={styles.recipeContent}>
                        <section className={styles.recipeHeader}>
                            <FontAwesomeIcon
                                icon={faArrowLeft}
                                onClick={() => navigate(-1)}
                                className={styles.arrowLeft}
                            />
                            <figure className={styles.recipeImageContainer}>
                                <img src={state.recipe?.recipe?.imageUrl} alt={state.recipe?.recipe?.title} className={styles.recipeFullImage} />
                            </figure>
                            <div className={styles.titleContainer}>
                                <h2 className={styles.recipeTitle}>
                                    {state.recipe?.recipe?.title}
                                </h2>
                                <div className={styles.iconContainer}>
                                    <FontAwesomeIcon
                                        icon={state.isLiked ? heartSolid : heartRegular}
                                        className={`${styles.heartIcon} ${state.isLiked ? styles.liked : ''}`}
                                        onClick={toggleLike}
                                    />
                                    <FontAwesomeIcon
                                        icon={solidShare}
                                        onClick={handleShareRecipe}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            </div>
                            <p className={styles.recipeDescription}>{state.recipe?.recipe?.description}</p>
                            <div className={styles.recipeMetaInfo}>
                                <div className={styles.metaItem}>
                                    <h3 className={styles.metaTitle}>Preparation Time</h3>
                                    <p className={styles.metaValue}>{state.recipe?.recipe?.preparationTime}</p>
                                </div>
                                <div className={styles.metaItem}>
                                    <h3 className={styles.metaTitle}>Cooking Time</h3>
                                    <p className={styles.metaValue}>{state.recipe?.recipe?.cookingTime}</p>
                                </div>
                            </div>
                        </section>

                        <section className={styles.recipeIngredients}>
                            <h3 className={styles.ingredientsTitle}>Ingredients</h3>
                            <ul className={styles.ingredientsList}>
                                {state.recipe?.recipe?.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </section>


                        <section className={styles.recipeSteps}>
                            <h3 className={styles.stepsTitle}>Steps</h3>
                            {state.recipe?.recipe?.steps.map((step, index) => (
                                <div key={index} className={styles.stepItem}>
                                    <h4 className={styles.stepTitle}>Step {index + 1}</h4>
                                    <p className={styles.stepDescription}>{step}</p>
                                </div>
                            ))}
                        </section>

                        <section className={styles.ratingOverview}>
                            <div className={styles.overallRating}>
                                <h3 className={styles.ratingScore}>{state.recipe.averageRating}</h3>
                                <div className={styles.starRating}>
                                    {[...Array(5)].map((_, starIndex) => (
                                        <span key={starIndex} className={styles.starIcon}>
                                            {starIndex < Math.round(state.recipe.averageRating) ? '★' : '☆'}
                                        </span>
                                    ))}
                                </div>
                                <p className={styles.reviewCount}>{state.recipe.totalRating} reviews</p>
                            </div>
                            <div className={styles.ratingDistribution}>
                                {Array.from({ length: 5 }, (_, index) => {
                                    const rating = 5 - index;
                                    return (
                                        <div className={styles.ratingBar} key={rating}>
                                            <span className={styles.ratingLabel}>{rating}</span>
                                            <div className={styles.ratingBarContainer}>
                                                <div
                                                    className={styles.ratingBarFill}
                                                    style={{ width: `${state.recipe?.ratingPercentages[`rating${rating}`]}%` }}
                                                />
                                            </div>
                                            <span className={styles.ratingPercentage}>{state.recipe?.ratingPercentages[`rating${rating}`]}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Feedback Form Section */}
                        <section className={styles.feedbackForm}>
                            <h3 className={styles.feedbackTitle}>Leave a Review</h3>
                            <form onSubmit={handleFeedbackSubmit} className={styles.feedbackFormContainer}>
                                <div className={styles.ratingSelection}>
                                    {[...Array(5)].map((_, starIndex) => (
                                        <span
                                            key={starIndex}
                                            className={styles.starIcon}
                                            onClick={() => setState((prev) => ({ ...prev, feedbackRating: starIndex + 1 }))}
                                        >
                                            {starIndex < state.feedbackRating ? '★' : '☆'}
                                        </span>
                                    ))}
                                </div>
                                <textarea
                                    className={styles.feedbackTextBox}
                                    placeholder='Write your feedback here...'
                                    value={state.feedbackComment}
                                    onChange={(e) => setState((prev) => ({ ...prev, feedbackComment: e.target.value }))}
                                />
                                {state.errorMessage && (
                                    <div className={styles.errorSpacing}>
                                        <Validation error={state.errorMessage} show={true} />
                                    </div>
                                )}
                                <Button type='submit' loading={state.isLoading} disabled={state.isLoading}>Submit</Button>
                            </form>
                        </section>

                        {/* Reviews Section */}
                        <section className={styles.reviews}>
                            <h3 className={styles.heading}>Reviews</h3>
                            {state.recipe?.feedbackData?.length > 0 ? (
                                state.recipe.feedbackData.map((feedback, index) => (
                                    <article key={index} className={styles.reviewItem}>
                                        <div className={styles.reviewHeader}>
                                            <div className={styles.profileCircle}>
                                                {feedback.userId.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className={styles.reviewerInfo}>
                                                <h3 className={styles.reviewerName}>{feedback.userId.name}</h3>
                                                <time className={styles.reviewDate}>{new Date(feedback.createdAt).toLocaleDateString()}</time>
                                            </div>
                                        </div>
                                        <div className={styles.reviewRating}>
                                            {[...Array(5)].map((_, starIndex) => (
                                                <span key={starIndex} className={styles.starIcon}>
                                                    {starIndex < feedback.ratingValue ? '★' : '☆'}
                                                </span>
                                            ))}
                                        </div>
                                        <p className={styles.reviewComment}>{feedback.commentText}</p>
                                    </article>
                                ))
                            ) : (
                                <p className={styles.heading}>No reviews yet.</p>
                            )}
                        </section>

                    </article>

                    {state.shareModalOpen && <ShareModal
                        isOpen={state.shareModalOpen}
                        onClose={() => setState((prev) => ({ ...prev, shareModalOpen: false }))}
                        recipeTitle={state.recipe?.recipe?.title}
                        recipeLink={window.location.href}
                    />}

                    {state.notFound && (
                        <div className={styles.noDataMessage}>
                            <h2>{state.errorMessage || 'Recipe Not Found'}</h2>
                            <Button onClick={() => navigate('/recipes')}>Back to Recipes</Button>
                        </div>
                    )}
                </>
            )}
        </main>
    );
};

export default withAuthentication(RecipeDetailsPage);