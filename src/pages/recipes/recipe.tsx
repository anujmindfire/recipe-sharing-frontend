import React, { useEffect, useCallback } from 'react';
import { Layout } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { GetServerSideProps } from 'next';
import { RootState } from '../../store/redux/store';
import { setRecipes, setTotalPages, setPage, setLoading, setUniquePrepTimes, setUniqueCookTimes, setErrorMessage, setShowErrorModal, setNotFound, setSearchParams } from '../../store/context/recpieListSlice';
import { sortTimes, handleModalClose } from '../../utils/commonFunction';
import { apiService } from '../../apiService/service';
import constant from '../../utils/constant';
import dynamic from 'next/dynamic';

// Dynamically import components
const RecipeCard = dynamic(() => import('../../components/RecipeCard'), { ssr: false });
const SearchFilterBar = dynamic(() => import('../../components/SearchFilterBar'), { ssr: false });
const Loader = dynamic(() => import('../../components/Loader'), { ssr: false });
const ErrorModal = dynamic(() => import('../../components/ErrorModal'), { ssr: false });
const ErrorBoundary = dynamic(() => import('../../components/ErrorBoundary'), { ssr: false });

const { Content } = Layout;

type RecipeListProps = {
    initialRecipes: any[];
    totalPages: number;
    uniquePrepTimes: string[];
    uniqueCookTimes: string[];
};

const RecipeList = ({ initialRecipes, totalPages, uniquePrepTimes, uniqueCookTimes }: RecipeListProps) => {
    const dispatch = useDispatch();
    const { recipes, page, loading, errorMessage, showErrorModal, searchParams, notFound } = useSelector((state: RootState) => state.recipeList);

    // Set initial data from server-side props to Redux store on first render
    useEffect(() => {
        dispatch(setRecipes(initialRecipes));
        dispatch(setTotalPages(totalPages));
        dispatch(setUniquePrepTimes(uniquePrepTimes));
        dispatch(setUniqueCookTimes(uniqueCookTimes));
    }, [initialRecipes, totalPages, uniquePrepTimes, uniqueCookTimes, dispatch]);

    const accesstoken = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.accessToken) : null;
    const userId = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.userId) : null;

    // Fetch additional recipes only when user interacts (pagination or filters)
    const fetchRecipes = useCallback(async () => {
        if (page === 1) return; // Do not fetch again if it's the first page (handled by SSR)

        dispatch(setLoading(true));
        dispatch(setShowErrorModal(false));

        const payload = {
            page,
            query: searchParams.query,
            rating: searchParams.rating,
            prepTime: searchParams.prepTime,
            cookTime: searchParams.cookTime,
            accesstoken,
            userId,
        };

        const result = await apiService(payload, constant.apiLabel.recipelist);

        if (result.success) {
            dispatch(setRecipes([...recipes, ...result.data.data]));
            dispatch(setNotFound(result.data.data.length === 0));
        } else {
            dispatch(setErrorMessage(result.message));
            dispatch(setShowErrorModal(true));
        }

        dispatch(setLoading(false));
    }, [page, searchParams, accesstoken, userId, dispatch, recipes]);

    // Only fetch more recipes on scroll or when the user changes pages
    useEffect(() => {
        if (page > 1) {
            fetchRecipes();
        }
    }, [page]);

    const handleScroll = useCallback(() => {
        const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1;
        if (bottom && !loading && page < totalPages) {
            dispatch(setPage(page + 1));
        }
    }, [loading, page, totalPages, dispatch]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleErrorModalClose = () => {
        handleModalClose(dispatch);
    };

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string | number } }) => {
            if ('target' in e && 'name' in e.target) {
                dispatch(setSearchParams({ [e.target.name]: e.target.value }));
                dispatch(setPage(1)); // Reset to page 1 when search params change
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
                        uniquePrepTimes={uniquePrepTimes}
                        uniqueCookTimes={uniqueCookTimes}
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

// Fetch data on the server-side
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { query } = context;
    const accesstoken = context.req.cookies[constant.localStorageKeys.accessToken] || null;
    const userId = context.req.cookies[constant.localStorageKeys.userId] || null;

    const payload = {
        page: 1,
        query: query.query || '',
        rating: query.rating || '',
        prepTime: query.prepTime || '',
        cookTime: query.cookTime || '',
        accesstoken,
        userId,
    };

    const result = await apiService(payload, constant.apiLabel.recipelist);

    if (result.success) {
        return {
            props: {
                initialRecipes: result.data.data,
                totalPages: Math.ceil(result.data.total / 20),
                uniquePrepTimes: sortTimes(result.data.uniquePreparationTimes),
                uniqueCookTimes: sortTimes(result.data.uniqueCookingTimes),
            },
        };
    } else {
        return {
            props: {
                initialRecipes: [],
                totalPages: 0,
                uniquePrepTimes: [],
                uniqueCookTimes: [],
            },
        };
    }
};

export default RecipeList;
