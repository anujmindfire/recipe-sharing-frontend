import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '../../store/redux/store';
import { setRecipes, setTotalPages, setPage, setLoading, setUniquePrepTimes, setUniqueCookTimes, setErrorMessage, setShowErrorModal, setNotFound, setSearchParams } from '../../store/context/recpieListSlice';
import { handleModalClose, sortTimes } from '../../utils/commonFunction';
import { apiService } from '../../apiService/service';
import Modal from '../../components/Model';
import RecipeCard from '../../components/RecipeCard';
import ProfileLayout from './index';
import SearchFilterBar from '../../components/SearchFilterBar';
import authenicateRoute from '../../utils/authenticatedRouteGuard';
import Loader from '../../components/Loader';
import ErrorModal from '../../components/ErrorModal';
import ErrorBoundary from '../../components/ErrorBoundary';
import Button from '../../components/Button';
import constant from '../../utils/constant';
import AddRecipe from './addRecipe';

const MyRecipe = () => {
    const dispatch = useDispatch();
    const { recipes, totalPages, page, loading, allUniquePrepTimes, allUniqueCookTimes, errorMessage, showErrorModal, searchParams, notFound } = useSelector((state: RootState) => state.recipeList);

    const accesstoken = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.accessToken) : null;
    const userId = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.userId) : null;

    const [isAddRecipeModalVisible, setAddRecipeModalVisible] = useState(false);
    const router = useRouter();
    const mainContentRef = useRef<HTMLDivElement | null>(null);

    const fetchRecipes = useCallback(async () => {
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
            location: router.pathname === constant.routes.myRecipe ? constant.label.myRecipe : constant.label.myFavo,
        };

        const result = await apiService(payload, constant.apiLabel.myRecipe);

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
            if (mainContentRef.current) {
                const bottom =
                    mainContentRef.current.scrollHeight -
                    mainContentRef.current.scrollTop <=
                    mainContentRef.current.clientHeight + 1;
                if (bottom && !loading && page < totalPages) {
                    dispatch(setPage(page + 1));
                }
            }
        };

        const currentRef = mainContentRef.current;

        if (currentRef) {
            currentRef.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, [loading, page, totalPages, mainContentRef, dispatch]);

    useEffect(() => {
        document.body.style.overflow = constant.label.hidden;
        return () => {
            document.body.style.overflow = constant.label.auto;
        };
    }, []);

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string | number } }) => {
            if ('target' in e && 'name' in e.target) {
                dispatch(setSearchParams({ [e.target.name]: e.target.value }));
            }
        },
        [dispatch]
    );

    const handleErrorModalClose = () => {
        handleModalClose(dispatch);
    };

    const openAddRecipeModal = () => {
        setAddRecipeModalVisible(true);
    };

    return (
        <ErrorBoundary>
            <ProfileLayout>
                <div className='overflow-y-auto max-h-[calc(100vh-30px)] p-4' ref={mainContentRef}>
                    <SearchFilterBar
                        searchParams={searchParams as { [key: string]: string | number }}
                        handleSearchChange={handleSearchChange}
                        uniquePrepTimes={allUniquePrepTimes}
                        uniqueCookTimes={allUniqueCookTimes}
                        placeholder={constant.searchLabel.recipe}
                    />

                    {router.pathname === constant.routes.myRecipe && (
                        <Button
                            className='absolute top-[180px] right-4 w-[100px] hover:bg-[#8a62e0] hover:scale-105 sm:relative sm:mb-2 sm:top-auto sm:right-auto sm:block sm:w-[100px] sm:ml-auto'
                            onClick={openAddRecipeModal}
                        >
                            {constant.label.addNew}
                        </Button>
                    )}

                    {loading && !notFound && <Loader />}
                    {notFound && <p className='flex justify-center items-center h-[50vh] text-xl text-gray-600 text-center'>{constant.label.noRecipeFound}</p>}
                    <RecipeCard recipes={recipes} />
                    {showErrorModal && <ErrorModal message={errorMessage} onClose={handleErrorModalClose} />}

                    <Modal isVisible={isAddRecipeModalVisible} onClose={() => setAddRecipeModalVisible(false)}>
                        <AddRecipe />
                    </Modal>
                </div>
            </ProfileLayout>
        </ErrorBoundary>
    );
};

export default authenicateRoute(MyRecipe);