import React, { useEffect, useState, useCallback } from 'react';
import styles from '../styles/RecipePage.module.css';
import RecipeCard from '../components/RecipeCard';
import SearchFilterBar from '../components/SearchFilterBar';
import withAuthentication from '../utils/withAuthenicate';
import Loader from '../components/Loader';
import ErrorModal from '../components/ErrorModal';
import { apiService } from '../apiService/Services.js';
import constant from '../utils/constant.js';
import { sortTimes, handleModalClose, handleInputChange } from '../utils/commonFunction.js';

const RecipeList = () => {
    const [status, setStatus] = useState({
        recipes: [],
        totalPages: 0,
        page: 1,
        loading: false,
        allUniquePrepTimes: [],
        allUniqueCookTimes: [],
        errorMessage: '',
        showErrorModal: false,
        searchParams: {
            query: '',
            rating: '',
            prepTime: '',
            cookTime: '',
        },
        notFound: false,
    });

    const { recipes, totalPages, page, loading, allUniquePrepTimes, allUniqueCookTimes, errorMessage, showErrorModal, searchParams, notFound } = status;

    const accesstoken = localStorage.getItem(constant.localStorageKeys.accessToken);
    const userId = localStorage.getItem(constant.localStorageKeys.userId);

    const fetchRecipes = useCallback(async () => {
        setStatus((prevState) => ({ ...prevState, loading: true, showErrorModal: false }));
    
        const payload = {
            page,
            query: searchParams.query,
            rating: searchParams.rating,
            prepTime: searchParams.prepTime,
            cookTime: searchParams.cookTime,
            accesstoken,
            userId
        };
    
        const result = await apiService(payload, constant.apiLabel.recipelist);
    
        if (result.success) {
            setStatus((prevState) => ({
                ...prevState,
                recipes: page === 1 ? result.data.data : [...prevState.recipes, ...result.data.data],
                totalPages: Math.ceil(result.data.total / 20),
                allUniquePrepTimes: sortTimes(result.data.uniquePreparationTimes),
                allUniqueCookTimes: sortTimes(result.data.uniqueCookingTimes),
                notFound: result.data.data.length === 0,
            }));
        } else {
            setStatus((prevState) => ({
                ...prevState,
                errorMessage: result.message,
                showErrorModal: true,
            }));
        }
        setStatus((prevState) => ({ ...prevState, loading: false }));
        
    }, [page, searchParams, accesstoken, userId]);

    useEffect(() => {
        fetchRecipes();
    }, [page, searchParams, fetchRecipes]);

    useEffect(() => {
        const handleScroll = () => {
            const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1;
            if (bottom && !loading && page < totalPages) {
                setStatus((prevState) => ({ ...prevState, page: prevState.page + 1 }));
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, page, totalPages]);

    const handleErrorModalClose = () => handleModalClose(setStatus);
    const handleSearchChange = useCallback((e) => {
        handleInputChange(e, setStatus);
    }, []);

    return (
        <div className={styles.recipeApp}>
            <main className={styles.mainContent}>
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
            </main>
        </div>
    );
};

export default withAuthentication(RecipeList);
