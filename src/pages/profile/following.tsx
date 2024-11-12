import Loader from '../../components/Loader';
import ErrorModal from '../../components/ErrorModal';
import Snackbar from '../../components/Snackbar';
import SearchFilterBar from '../../components/SearchFilterBar';
import ErrorBoundary from '../../components/ErrorBoundary';
import authenicateRoute from '../../utils/authenticatedRouteGuard';
import constant from '../../utils/constant';
import ProfileLayout from './index';
import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '../../store/redux/store';
import { setProfile, setTotalPages, setPage, setSuccessMessage, toggleSnackbar, setLoading, setErrorMessage, setShowErrorModal, setNotFound, setSearchParams } from '../../store/context/profileListSlice';
import { handleModalClose } from '../../utils/commonFunction';
import { apiService } from '../../apiService/service';
import { ProfileProps } from '../../interface/Interface';

const ProfileList = () => {
    const dispatch = useDispatch();
    const { profiles, totalPages, page, successMessage, showSnackbar, loading, errorMessage, showErrorModal, searchParams, notFound } = useSelector((state: RootState) => state.profileList);

    const accesstoken = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.accessToken) : null;
    const userId = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.userId) : null;

    const router = useRouter();
    const mainContentRef = useRef<HTMLDivElement | null>(null);
    const defaultProfilePicture = constant.imageLink.profileIcon;

    const fetchProfiles = useCallback(async () => {
        dispatch(setLoading(true));
        dispatch(setShowErrorModal(false));

        const { query } = searchParams;

        const pathMap = {
            [constant.routes.users]: { allUser: true },
            [constant.routes.following]: { following: true },
            [constant.routes.followers]: { follower: true },
        };

        const queryParams = pathMap[router.pathname];
        if (!queryParams) return;

        const payload = {
            pathMap: { ...queryParams },
            accesstoken,
            userId,
            page: page,
            searchKey: query
        }

        const result = await apiService(payload, constant.apiLabel.userProfile);
        if (result.success) {

            const updatedProfiles: ProfileProps[] = result.data.data.map((profile: ProfileProps) => ({
                ...profile,
                profileImage: defaultProfilePicture,
            }));

            const uniqueProfiles: ProfileProps[] = Array.from(
                new Map(updatedProfiles.map(profile => [profile._id, profile])).values()
            );
            dispatch(setProfile(uniqueProfiles));
            dispatch(setTotalPages(Math.ceil(result.data.total / 20)));
            dispatch(setNotFound(uniqueProfiles.length === 0));
        } else {
            dispatch(setErrorMessage(result.message));
            dispatch(setShowErrorModal(true));
        }
        dispatch(setLoading(false));
    }, [page, searchParams, accesstoken, userId, router.pathname, defaultProfilePicture, dispatch]);

    const handleFollowAndUnFollowClick = async (profileId: string, isFollowing: boolean, unfollow: boolean = false) => {
        dispatch(setLoading(true));
        dispatch(setShowErrorModal(false));

        const followAction = !isFollowing;
        const unfollowBody = unfollow ? unfollow : router.pathname === constant.routes.followers;

        const payload = {
            followerId: userId,
            followedId: profileId,
            follow: unfollowBody ? false : followAction,
            unfollowBody,
            accesstoken,
            userId
        }

        const result = await apiService(payload, constant.apiLabel.followClick);
        if (result.success) {
            dispatch(setSuccessMessage(result.data.message));
            dispatch(toggleSnackbar(true));
            setTimeout(() => window.location.reload(), 1000);
        } else {
            dispatch(setErrorMessage(result.message));
            dispatch(setShowErrorModal(true));
        }
        dispatch(setLoading(false));
    };

    useEffect(() => {
        fetchProfiles();
    }, [page, searchParams]);

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

    return (
        <ErrorBoundary>
            <ProfileLayout>
                <div
                    className='justify-start min-h-[800px] w-full bg-gray-900 relative max-h-[calc(100vh-30px)] p-4'
                    ref={mainContentRef}
                >
                    <SearchFilterBar
                        searchParams={searchParams as { [key: string]: string | number }}
                        handleSearchChange={handleSearchChange}
                        uniquePrepTimes={[]}
                        uniqueCookTimes={[]}
                        placeholder={constant.searchLabel.user}
                    />

                    <section className='flex flex-col'>
                        {loading ? (
                            <Loader />
                        ) : notFound ? (
                            <p className='flex justify-center items-center h-[50vh] text-2xl text-gray-600 text-center'>
                                {constant.label.noProfileFound}
                            </p>
                        ) : profiles.length > 0 ? (
                            profiles.map((profile) => (
                                <article
                                    key={profile._id}
                                    className='flex items-center justify-between bg-gray-900 p-3 border-b border-gray-300'
                                >
                                    <div className='flex items-center'>
                                        <img
                                            src={profile.profileImage}
                                            alt={profile.name}
                                            className='w-10 h-10 rounded-full object-cover'
                                        />
                                        <div className='ml-3 text-gray-200'>
                                            <h2>{profile.name}</h2>
                                        </div>
                                    </div>
                                    {router.pathname === constant.routes.users ? (
                                        <div className='flex gap-2 items-center'>
                                            {profile.unfollow && profile.followback && !profile.follow && (
                                                <>
                                                    <button
                                                        className='rounded-full bg-gray-200 flex items-center justify-center px-4 h-10 min-w-[84px] hover:bg-gray-300'
                                                        onClick={() => handleFollowAndUnFollowClick(profile._id, true, true)}
                                                    >
                                                        <span className='text-sm font-medium text-yellow-800'>
                                                            {constant.label.unfollow}
                                                        </span>
                                                    </button>
                                                    <button
                                                        className='rounded-full bg-gray-200 flex items-center justify-center px-4 h-10 min-w-[84px] hover:bg-gray-300'
                                                        onClick={() => handleFollowAndUnFollowClick(profile._id, false)}
                                                    >
                                                        <span className='text-sm font-medium text-yellow-800'>
                                                            {constant.label.followBack}
                                                        </span>
                                                    </button>
                                                </>
                                            )}
                                            {profile.unfollow && !profile.followback && !profile.follow && (
                                                <button
                                                    className='rounded-full bg-gray-200 flex items-center justify-center px-4 h-10 min-w-[84px] hover:bg-gray-300'
                                                    onClick={() => handleFollowAndUnFollowClick(profile._id, true)}
                                                >
                                                    <span className='text-sm font-medium text-yellow-800'>
                                                        {constant.label.unfollow}
                                                    </span>
                                                </button>
                                            )}
                                            {!profile.unfollow && !profile.followback && profile.follow && (
                                                <button
                                                    className='rounded-full bg-gray-200 flex items-center justify-center px-4 h-10 min-w-[84px] hover:bg-gray-300'
                                                    onClick={() => handleFollowAndUnFollowClick(profile._id, false)}
                                                >
                                                    <span className='text-sm font-medium text-yellow-800'>
                                                        {constant.label.follow}
                                                    </span>
                                                </button>
                                            )}
                                        </div>
                                    ) : (router.pathname === constant.routes.following ||
                                        router.pathname === constant.routes.followers) && (
                                        <button
                                            className='rounded-full bg-gray-200 flex items-center justify-center px-4 h-10 min-w-[84px] hover:bg-gray-300'
                                            onClick={() => handleFollowAndUnFollowClick(profile._id, true)}
                                        >
                                            <span className='text-sm font-medium text-yellow-800'>
                                                {constant.label.unfollow}
                                            </span>
                                        </button>
                                    )}
                                </article>
                            ))
                        ) : (
                            <p className='flex justify-center items-center h-[50vh] text-2xl text-gray-600 text-center'>
                                {constant.label.noProfileFound}
                            </p>
                        )}
                    </section>
                    {showErrorModal && <ErrorModal message={errorMessage} onClose={handleErrorModalClose} />}
                    <Snackbar
                        message={successMessage}
                        isVisible={showSnackbar}
                        onClose={() => dispatch(toggleSnackbar(false))}
                    />
                </div>
            </ProfileLayout>
        </ErrorBoundary>
    );
};

export default authenicateRoute(ProfileList);