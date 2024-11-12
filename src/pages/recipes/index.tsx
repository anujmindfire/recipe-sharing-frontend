import React, { useEffect, useCallback, useMemo } from 'react';
import { Layout } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/redux/store';
import { setRecipes, setTotalPages, setPage, setLoading, setUniquePrepTimes, setUniqueCookTimes, setErrorMessage, setShowErrorModal, setNotFound, setSearchParams } from '../../store/context/recpieListSlice';
import { sortTimes, handleModalClose } from '../../utils/commonFunction';
import { apiService } from '../../apiService/service';
import RecipeCard from '../../components/RecipeCard';
import SearchFilterBar from '../../components/SearchFilterBar';
import authenicatedRoute from '../../utils/authenticatedRouteGuard';
import Loader from '../../components/Loader';
import ErrorModal from '../../components/ErrorModal';
import ErrorBoundary from '../../components/ErrorBoundary';
import constant from '../../utils/constant';

const { Content } = Layout;

const RecipeList = () => {

    const dispatch = useDispatch();
    const { recipes, totalPages, page, loading, allUniquePrepTimes, allUniqueCookTimes, errorMessage, showErrorModal, searchParams, notFound } = useSelector((state: RootState) => state.recipeList);
    
    const initialSearchParams = useMemo(() => ({
        query: searchParams.query,
        rating: searchParams.rating,
        prepTime: searchParams.prepTime,
        cookTime: searchParams.cookTime,
    }), []);

    const accesstoken = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.accessToken) : null;
    const userId = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.userId) : null;

    const fetchRecipes = useCallback(async () => {
        dispatch(setLoading(true));
        dispatch(setShowErrorModal(false));

        const payload = {
            page,
            initialSearchParams,
            accesstoken,
            userId,
        };

        const result = await apiService(payload, constant.apiLabel.recipelist);

        if (result.success) {
            dispatch(setRecipes(page === 1 ? result.data.data : [...recipes, ...result.data.data]));
            dispatch(setTotalPages(Math.ceil(result.data.total / 20)));
            dispatch(setUniquePrepTimes(sortTimes(result.data.uniquePreparationTimes)));
            dispatch(setUniqueCookTimes(sortTimes(result.data.uniqueCookingTimes)));
            dispatch(setNotFound(result.data.data.length === 0));
        } else {
            dispatch(setErrorMessage(result.message));
            dispatch(setShowErrorModal(true));
        }

        dispatch(setLoading(false));
    }, [page, searchParams, accesstoken, userId, dispatch]);

    useEffect(() => {
        fetchRecipes();
    }, [page, searchParams, fetchRecipes]);

    useEffect(() => {
        const handleScroll = () => {
            const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1;
            if (bottom && !loading && page < totalPages) {
                dispatch(setPage(page + 1));
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, page, totalPages]);

    const handleErrorModalClose = () => {
        handleModalClose(dispatch);
    };

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string | number } }) => {
            if ('target' in e && 'name' in e.target) {
                dispatch(setSearchParams({ [e.target.name]: e.target.value }));
            }
        },
        [dispatch]
    );

    return (
        <ErrorBoundary>
            <Layout className='bg-gray-800 flex flex-col justify-start min-h-screen w-full overflow-hidden'>
                <Content className='flex flex-col flex-1 p-5 md:p-20 min-h-screen box-border'>
                    <SearchFilterBar
                        searchParams={searchParams as { [key: string]: string | number }}
                        handleSearchChange={handleSearchChange}
                        uniquePrepTimes={allUniquePrepTimes}
                        uniqueCookTimes={allUniqueCookTimes}
                        placeholder={constant.searchLabel.recipe}
                    />
                    {loading && !notFound && <Loader />}
                    {notFound && (
                        <p className='flex justify-center items-center h-1/2 text-2xl text-gray-500 text-center'>
                            {constant.label.noRecipeFound}
                        </p>
                    )}
                    <RecipeCard recipes={recipes} />
                    {showErrorModal && <ErrorModal message={errorMessage} onClose={handleErrorModalClose} />}
                </Content>
            </Layout>
        </ErrorBoundary>
    );
};

export default authenicatedRoute(RecipeList);