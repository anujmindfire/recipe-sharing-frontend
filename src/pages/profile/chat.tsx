import Loader from '../../components/Loader';
import SearchFilterBar from '../../components/SearchFilterBar';
import ErrorBoundary from '../../components/ErrorBoundary';
import ProfileLayout from './index';
import Message from './message';
import authenicateRoute from '../../utils/authenticatedRouteGuard';
import constant from '../../utils/constant';
import ErrorModal from '../../components/ErrorModal';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/redux/store';
import { setProfile, setTotalPages, setPage, setLoading, setErrorMessage, setShowErrorModal, setNotFound, setSearchParams } from '../../store/context/profileListSlice';
import { apiService } from '../../apiService/service';
import { handleModalClose } from '../../utils/commonFunction';
import { ProfileProps } from '../../interface/Interface';

const ChatSidebar = () => {
    const dispatch = useDispatch();
    const { profiles, totalPages, page, loading, errorMessage, showErrorModal, searchParams, notFound } = useSelector((state: RootState) => state.profileList);
    const [selectedChatUser, setSelectedChatUser] = useState<ProfileProps | null>(null);

    const accesstoken = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.accessToken) : null;
    const userId = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.userId) : null;

    const mainContentRef = useRef<HTMLDivElement | null>(null);
    const defaultProfilePicture = constant.imageLink.profileIcon;

    const handleChatOpen = (user: ProfileProps) => {
        setSelectedChatUser(user);
        constant.localStorageUtils.setItem(constant.localStorageKeys.selectedChatUserId, user._id);
    };

    const fetchProfiles = useCallback(async () => {
        dispatch(setLoading(true));
        dispatch(setShowErrorModal(false));

        const { query } = searchParams;

        const payload = {
            pathMap: { allUser: true },
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
    }, [page, searchParams, accesstoken, userId, defaultProfilePicture, dispatch]);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

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

    useEffect(() => {
        document.body.style.overflow = constant.label.hidden;

        const storedChatUserId = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.selectedChatUserId) : null;
        if (storedChatUserId) {
            const storedChatUser = profiles.find(user => user._id === storedChatUserId);
            if (storedChatUser) {
                setSelectedChatUser(storedChatUser);
            }
        }

        return () => {
            document.body.style.overflow = constant.label.auto;
        };
    }, [profiles]);

    return (
        <ErrorBoundary>
            <ProfileLayout>
                <div className='flex h-screen'>
                    <aside className='overflow-y-auto max-h-full p-4 flex flex-col min-w-[240px] w-[320px] h-full bg-gray-800' ref={mainContentRef}>
                        <SearchFilterBar
                            searchParams={searchParams as { [key: string]: string | number }}
                            handleSearchChange={handleSearchChange}
                            uniquePrepTimes={[]}
                            uniqueCookTimes={[]}
                            placeholder={constant.searchLabel.user}
                        />
                        <nav>
                            <ul>
                                {loading ? (
                                    <Loader />
                                ) : notFound ? (
                                    <p className='flex justify-center items-center h-[50vh] text-xl text-gray-500'>
                                        {constant.label.noProfileFound}
                                    </p>
                                ) : profiles && profiles.length > 0 ? (
                                    profiles.map((user) => (
                                        <li
                                            key={user._id}
                                            className='flex items-center justify-between bg-gray-800 min-h-[56px] p-4 border-b border-gray-700'
                                        >
                                            <div className='flex items-center gap-4 text-gray-200'>
                                                <img
                                                    loading='lazy'
                                                    src={defaultProfilePicture}
                                                    className='w-10 h-10 rounded-full object-cover'
                                                    alt={`${user.name}'s avatar`}
                                                />
                                                <div className='flex-1 overflow-hidden text-ellipsis whitespace-nowrap'>
                                                    {user.name}
                                                </div>
                                            </div>
                                            <button
                                                className='ml-4'
                                                aria-label={`Chat with ${user.name}`}
                                                onClick={() => handleChatOpen(user)}
                                            >
                                                <img
                                                    loading='lazy'
                                                    src={constant.imageLink.chatIcon}
                                                    className='w-6 h-6 filter invert'
                                                    alt={constant.imageAlt.chaticons}
                                                />
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <p className='flex justify-center items-center h-[50vh] text-xl text-gray-500'>
                                        {constant.label.noProfileFound}
                                    </p>
                                )}
                            </ul>
                        </nav>
                    </aside>

                    {showErrorModal && (
                        <ErrorModal message={errorMessage} onClose={handleErrorModalClose} />
                    )}

                    {selectedChatUser && (
                        <div className='flex-1 p-6 flex flex-col justify-between'>
                            <Message
                                sender={userId}
                                receiver={selectedChatUser._id}
                                receiverName={selectedChatUser.name}
                            />
                        </div>
                    )}
                </div>
            </ProfileLayout>
        </ErrorBoundary>
    );
}

export default authenicateRoute(ChatSidebar)