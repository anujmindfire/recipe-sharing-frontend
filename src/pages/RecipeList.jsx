import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/RecipePage.module.css';
import RecipeCard from '../components/RecipeCard';
import SearchFilterBar from '../components/SearchFilterBar';
import withAuthentication from '../utils/withAuthenicate';
import { backendURL } from '../api/url';
import Loader from '../components/Loader';
import ErrorModal from '../components/ErrorModal';
import { refreshAccessToken } from '../utils/tokenServices';

const RecipeList = () => {
    const [status, setStatus] = useState({
        recipes: [],
        totalPages: 0,
        page: 1,
        isLoading: false,
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

    const navigate = useNavigate();
    const { recipes, totalPages, page, isLoading, allUniquePrepTimes, allUniqueCookTimes, errorMessage, showErrorModal, searchParams, notFound } = status;

    const accesstoken = localStorage.getItem('accesstoken');
    const refreshtoken = localStorage.getItem('refreshtoken');
    const userId = localStorage.getItem('id');

    const parseTimeString = (timeString) => {
        const [value, unit] = timeString.split(' ');
        return unit.includes('hour') ? parseInt(value) * 60 : parseInt(value);
    };

    const sortTimes = useCallback((times) => {
        return times.sort((a, b) => parseTimeString(a) - parseTimeString(b));
    }, []);

    const fetchRecipes = useCallback(async () => {
        setStatus((prevState) => ({ ...prevState, isLoading: true, showErrorModal: false }));
        const { query, rating, prepTime, cookTime } = searchParams;
    
        try {
            const response = await fetch(`${backendURL}/recipe?page=${page}${query ? '' : '&limit=20'}&searchKey=${query}&ratingValue=${rating}&preparationTime=${prepTime}&cookingTime=${cookTime}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    accesstoken,
                    id: userId,
                },
            });
    
            const data = await response.json();
            if (response.ok) {
                setStatus((prevState) => ({
                    ...prevState,
                    recipes: page === 1 ? data.data : [...prevState.recipes, ...data.data],
                    totalPages: Math.ceil(data.total / 20),
                    allUniquePrepTimes: sortTimes(data.uniquePreparationTimes),
                    allUniqueCookTimes: sortTimes(data.uniqueCookingTimes),
                    notFound: data.data.length === 0,
                }));
            } else if (response.status === 401 || data.unauthorized) {
                await refreshAccessToken(refreshtoken, userId, navigate);
            } else {
                setStatus((prevState) => ({
                    ...prevState,
                    errorMessage: data.message,
                    showErrorModal: true,
                }));
            }
        } catch (error) {
            setStatus((prevState) => ({
                ...prevState,
                errorMessage: 'An error occurred while fetching recipes.',
                showErrorModal: true,
            }));
        } finally {
            setStatus((prevState) => ({ ...prevState, isLoading: false }));
        }
    }, [accesstoken, userId, page, searchParams, refreshtoken, navigate, sortTimes]);    

    useEffect(() => {
        fetchRecipes();
    }, [page, searchParams, fetchRecipes]);

    useEffect(() => {
        const handleScroll = () => {
            const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1;
            if (bottom && !isLoading && page < totalPages) {
                setStatus((prevState) => ({ ...prevState, page: prevState.page + 1 }));
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, page, totalPages]);

    const handleErrorModalClose = () => {
        setStatus((prevState) => ({
            ...prevState,
            showErrorModal: false,
            errorMessage: '',
        }));
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setStatus((prevState) => ({
            ...prevState,
            searchParams: { ...prevState.searchParams, [name]: value },
            page: 1,
            recipes: [],
        }));
    };

    return (
        <div className={styles.recipeApp}>
            <main className={styles.mainContent}>
                <SearchFilterBar
                    searchParams={searchParams}
                    handleSearchChange={handleSearchChange}
                    uniquePrepTimes={allUniquePrepTimes}
                    uniqueCookTimes={allUniqueCookTimes}
                    placeholder='Search Recipes...'
                />
                {isLoading && !notFound && <Loader />}
                {notFound && <p className={styles.noDataMessage}>No recipes found</p>}
                <RecipeCard recipes={recipes} />
                {showErrorModal && <ErrorModal message={errorMessage} onClose={handleErrorModalClose} />}
            </main>
        </div>
    );
};

export default withAuthentication(RecipeList);
