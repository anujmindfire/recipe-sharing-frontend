import React, { useState, useCallback, useRef, useMemo } from 'react';
import RecipeCard from '../components/RecipeCard';
import SearchFilterBar from '../components/SearchFilterBar';
import Loader from '../components/Loader';
import ErrorModal from '../components/ErrorModal';
import withAuthentication from '../utils/withAuthenicate';
import { useLocation } from 'react-router-dom';
import styles from '../styles/ProfilePage.module.css';
import constant from '../utils/constant';
import { handleInputChange, handleModalClose, sortTimes, useScrollPagination } from '../utils/commonFunction';
import { apiService } from '../apiService/Services';

const MyRecipe = () => {
    const initialSearchParams = useMemo(() => ({
        query: '',
        rating: '',
        prepTime: '',
        cookTime: '',
    }), []);

    const [status, setStatus] = useState({
        recipes: [],
        totalPages: 0,
        page: 1,
        loading: false,
        allUniquePrepTimes: [],
        allUniqueCookTimes: [],
        errorMessage: '',
        showErrorModal: false,
        searchParams: initialSearchParams,
        notFound: false,
    });

    const { recipes, totalPages, page, loading, allUniquePrepTimes, allUniqueCookTimes, errorMessage, showErrorModal, searchParams, notFound } = status;

    const accesstoken = localStorage.getItem(constant.localStorageKeys.accessToken);
    const userId = localStorage.getItem(constant.localStorageKeys.userId);
    const location = useLocation();
    const mainContentRef = useRef(null);

    const fetchRecipes = useCallback(async () => {
        setStatus((prevState) => ({ ...prevState, loading: true, showErrorModal: false }));

        const payload = {
            page,
            query: searchParams.query,
            rating: searchParams.rating,
            prepTime: searchParams.prepTime,
            cookTime: searchParams.cookTime,
            accesstoken,
            userId,
            location: location.pathname === constant.routes.myRecipe ? constant.label.myRecipe : constant.label.myFavo
        }

        const result = await apiService(payload, constant.apiLabel.myRecipe);
        if (result.success) {
            setStatus((prev) => ({
                ...prev,
                recipes: page === 1 ? result.data.data : [...prev.recipes, ...result.data.data],
                totalPages: Math.ceil(result.data.total / 20),
                allUniquePrepTimes: sortTimes(result.data.uniquePreparationTimes),
                allUniqueCookTimes: sortTimes(result.data.uniqueCookingTimes),
                notFound: result.data.data.length === 0,
            }));
        } else {
            setStatus((prev) => ({ ...prev, loading: false }));
        }
        setStatus((prev) => ({ ...prev, loading: false }));
    }, [accesstoken, userId, page, searchParams, location.pathname]);

    useScrollPagination(initialSearchParams, setStatus, fetchRecipes, loading, totalPages, page, mainContentRef);

    const handleSearchChange = useCallback((e) => {
        handleInputChange(e, setStatus);
    }, []);

    const handleErrorModalClose = () => handleModalClose(setStatus);

    return (
        <div className={styles.scrollContainer} ref={mainContentRef}>
            <SearchFilterBar
                searchParams={searchParams}
                handleSearchChange={handleSearchChange}
                uniquePrepTimes={allUniquePrepTimes}
                uniqueCookTimes={allUniqueCookTimes}
                placeholder={constant.searchLabel.recipe}
            />

            {loading && !notFound && <Loader />}
            {notFound && <p className={styles.noDataMessage}>{constant.label.noRecipeFound}</p>}
            <RecipeCard recipes={recipes} />
            {showErrorModal && <ErrorModal message={errorMessage} onClose={handleErrorModalClose} />}
        </div>
    );
};

export default withAuthentication(MyRecipe);