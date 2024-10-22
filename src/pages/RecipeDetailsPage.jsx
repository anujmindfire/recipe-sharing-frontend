import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/RecipePage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as heartRegular, faHeart as heartSolid, faShareNodes as solidShare, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button';
import Validation from '../components/Validation';
import Loader from '../components/Loader';
import ShareModal from '../components/ShareModal';
import ErrorModal from '../components/ErrorModal';
import withAuthentication from '../utils/withAuthenicate';
import { apiService } from '../apiService/Services.js';
import constant from '../utils/constant.js';
import { handleModalClose } from '../utils/commonFunction.js';

const RecipeDetailsPage = () => {
    const [status, setStatus] = useState({
        recipe: null,
        feedbackRating: 0,
        feedbackComment: '',
        isLiked: false,
        loading: true,
        errorMessage: '',
        notFound: false,
        shareModalOpen: false,
        showErrorModal: false
    });
    const { id } = useParams();
    const navigate = useNavigate();
    const accesstoken = localStorage.getItem(constant.localStorageKeys.accessToken);
    const userId = localStorage.getItem(constant.localStorageKeys.userId);

    const fetchRecipeDetails = useCallback(async () => {
        setStatus((prev) => ({ ...prev, loading: true, showErrorModal: false, notFound: false }));

        const payload = { id, accesstoken, userId };

        const result = await apiService(payload, constant.apiLabel.oneRecipe);

        if (result.success) {
            setStatus((prev) => ({
                ...prev,
                recipe: result.data.data,
                isLiked: result.data.data.isSaved,
                loading: false
            }));
        } else {
            setStatus((prev) => ({
                ...prev,
                notFound: true,
                errorMessage: result.message,
                showErrorModal: true,
                loading: false
            }));
        }
        setStatus((prevState) => ({ ...prevState, loading: false }));
    }, [id, accesstoken, userId]);

    useEffect(() => {
        fetchRecipeDetails();
    }, [fetchRecipeDetails]);

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();

        setStatus((prev) => ({ ...prev, errorMessage: '' }));

        if (status.feedbackRating === 0 || status.feedbackComment.trim() === '') {
            setStatus((prev) => ({ ...prev, errorMessage: constant.validationMessage.invalidFeedback }));
            return;
        }

        const payload = {
            recipeId: id,
            ratingValue: status.feedbackRating,
            commentText: status.feedbackComment,
            accesstoken, 
            userId
        }

        setStatus(prev => ({ ...prev, loading: true, errorMessage: '' }));

        const result = await apiService(payload, constant.apiLabel.addRating);
        if (result.success) {
            window.location.reload();
        } else {
            setStatus((prev) => ({ ...prev, errorMessage: result.message }));
        }
        setStatus(prev => ({ ...prev, loading: false }));
    };

    const handleShareRecipe = () => {
        setStatus((prev) => ({ ...prev, shareModalOpen: true }));
    };

    const toggleLike = async () => {

        setStatus((prev) => ({ ...prev, loading: true }));

        const payload = {
            recipeId: id,
            add: !status.isLiked,
            accesstoken,
            userId
        }

        const result = await apiService(payload, constant.apiLabel.savedRecipe);

        if (result.success) {
            setStatus((prev) => ({ ...prev, isLiked: !prev.isLiked }));
        } else {
            setStatus((prev) => ({ ...prev, errorMessage: result.message }));
        }
        setStatus(prev => ({ ...prev, loading: false }));
    };

    const handleErrorModalClose = () => handleModalClose(setStatus);

    return (
        <main className={styles.recipeReview}>
            {status.loading && !status.notFound && <Loader />}
            {status.notFound && <p className={styles.noDataMessage}>{constant.label.noRecipeFound}</p>}
            {status.showErrorModal && <ErrorModal message={status.errorMessage} onClose={handleErrorModalClose} />}
            {status.recipe && !status.loading && (
                <>
                    <article className={styles.recipeContent}>
                        <section className={styles.recipeHeader}>
                            <FontAwesomeIcon
                                icon={faArrowLeft}
                                onClick={() => navigate(-1)}
                                className={styles.arrowLeft}
                            />
                            <figure className={styles.recipeImageContainer}>
                                <img src={status.recipe?.recipe?.imageUrl} alt={status.recipe?.recipe?.title} className={styles.recipeFullImage} />
                            </figure>
                            <div className={styles.titleContainer}>
                                <h2 className={styles.recipeTitle}>
                                    {status.recipe?.recipe?.title}
                                </h2>
                                <div className={styles.iconContainer}>
                                    <FontAwesomeIcon
                                        icon={status.isLiked ? heartSolid : heartRegular}
                                        className={`${styles.heartIcon} ${status.isLiked ? styles.liked : ''}`}
                                        onClick={toggleLike}
                                    />
                                    <FontAwesomeIcon
                                        icon={solidShare}
                                        onClick={handleShareRecipe}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            </div>
                            <p className={styles.recipeDescription}>{status.recipe?.recipe?.description}</p>
                            <div className={styles.recipeMetaInfo}>
                                <div className={styles.metaItem}>
                                    <h3 className={styles.metaTitle}>{constant.label.prepationTime}</h3>
                                    <p className={styles.metaValue}>{status.recipe?.recipe?.preparationTime}</p>
                                </div>
                                <div className={styles.metaItem}>
                                    <h3 className={styles.metaTitle}>{constant.label.cookingTime}</h3>
                                    <p className={styles.metaValue}>{status.recipe?.recipe?.cookingTime}</p>
                                </div>
                            </div>
                        </section>

                        <section className={styles.recipeIngredients}>
                            <h3 className={styles.ingredientsTitle}>{constant.label.ingredients}</h3>
                            <ul className={styles.ingredientsList}>
                                {status.recipe?.recipe?.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </section>


                        <section className={styles.recipeSteps}>
                            <h3 className={styles.stepsTitle}>{constant.label.steps}</h3>
                            {status.recipe?.recipe?.steps.map((step, index) => (
                                <div key={index} className={styles.stepItem}>
                                    <h4 className={styles.stepTitle}>{constant.label.step}{index + 1}</h4>
                                    <p className={styles.stepDescription}>{step}</p>
                                </div>
                            ))}
                        </section>

                        <section className={styles.ratingOverview}>
                            <div className={styles.overallRating}>
                                <h3 className={styles.ratingScore}>{status.recipe.averageRating}</h3>
                                <div className={styles.starRating}>
                                    {[...Array(5)].map((_, starIndex) => (
                                        <span key={starIndex} className={styles.starIcon}>
                                            {starIndex < Math.round(status.recipe.averageRating) ? '★' : '☆'}
                                        </span>
                                    ))}
                                </div>
                                <p className={styles.reviewCount}>{status.recipe.totalRating}{constant.label.review}</p>
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
                                                    style={{ width: `${status.recipe?.ratingPercentages[`rating${rating}`]}%` }}
                                                />
                                            </div>
                                            <span className={styles.ratingPercentage}>{status.recipe?.ratingPercentages[`rating${rating}`]}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Feedback Form Section */}
                        <section className={styles.feedbackForm}>
                            <h3 className={styles.feedbackTitle}>{constant.label.leaveComment}</h3>
                            <form onSubmit={handleFeedbackSubmit} className={styles.feedbackFormContainer}>
                                <div className={styles.ratingSelection}>
                                    {[...Array(5)].map((_, starIndex) => (
                                        <span
                                            key={starIndex}
                                            className={styles.starIcon}
                                            onClick={() => setStatus((prev) => ({ ...prev, feedbackRating: starIndex + 1 }))}
                                        >
                                            {starIndex < status.feedbackRating ? '★' : '☆'}
                                        </span>
                                    ))}
                                </div>
                                <textarea
                                    className={styles.feedbackTextBox}
                                    placeholder={constant.label.feedbackPlaceholder}
                                    value={status.feedbackComment}
                                    onChange={(e) => setStatus((prev) => ({ ...prev, feedbackComment: e.target.value }))}
                                />
                                {status.errorMessage && (
                                    <div className={styles.errorSpacing}>
                                        <Validation error={status.errorMessage} show={true} />
                                    </div>
                                )}
                                <Button type={constant.buttonType.submit} loading={status.loading} disabled={status.loading}>{constant.label.submit}</Button>
                            </form>
                        </section>

                        {/* Reviews Section */}
                        <section className={styles.reviews}>
                            <h3 className={styles.heading}>{constant.label.reviews}</h3>
                            {status.recipe?.feedbackData?.length > 0 ? (
                                status.recipe.feedbackData.map((feedback, index) => (
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
                                <p className={styles.heading}>{constant.label.noReview}</p>
                            )}
                        </section>

                    </article>

                    {status.shareModalOpen && <ShareModal
                        isOpen={status.shareModalOpen}
                        onClose={() => setStatus((prev) => ({ ...prev, shareModalOpen: false }))}
                        recipeTitle={status.recipe?.recipe?.title}
                        recipeLink={window.location.href}
                    />}
                </>
            )}
        </main>
    );
};

export default withAuthentication(RecipeDetailsPage);