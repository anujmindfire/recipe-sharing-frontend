import React, { useState, useCallback, useRef, useMemo } from 'react';
import styles from '../styles/ProfileList.module.css';
import Loader from '../components/Loader';
import ErrorModal from '../components/ErrorModal';
import Snackbar from '../components/Snackbar';
import SearchFilterBar from '../components/SearchFilterBar';
import { useLocation } from 'react-router-dom';
import withAuthentication from '../utils/withAuthenicate';
import constant from '../utils/constant';
import { handleInputChange, handleModalClose, useScrollPagination } from '../utils/commonFunction';
import { apiService } from '../apiService/Services';

const ProfileList = () => {
    const initialSearchParams = useMemo(() => ({
        query: '',
    }), []);

    const [status, setStatus] = useState({
        profiles: [],
        totalPages: 0,
        page: 1,
        loading: false,
        errorMessage: '',
        showErrorModal: false,
        searchParams: initialSearchParams,
        notFound: false,
        showSnackbar: false,
        successMessage: ''
    });

    const { totalPages, page, loading, errorMessage, showSnackbar, showErrorModal, successMessage, searchParams, notFound } = status;
    const accesstoken = localStorage.getItem(constant.localStorageKeys.accessToken);
    const userId = localStorage.getItem(constant.localStorageKeys.userId);
    const location = useLocation();
    const mainContentRef = useRef(null);
    const defaultProfilePicture = constant.imageLink.profileIcon;

    const fetchProfiles = useCallback(async () => {
        setStatus((prevState) => ({ ...prevState, loading: true, showErrorModal: false }));

        const { query } = searchParams;

        const pathMap = {
            [constant.routes.users]: { allUser: true },
            [constant.routes.following]: { following: true },
            [constant.routes.followers]: { follower: true },
        };

        const queryParams = pathMap[location.pathname];
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
            const updatedProfiles = result.data.data.map(profile => ({
                ...profile,
                profileImage: defaultProfilePicture,
            }));

            const uniqueProfiles = Array.from(new Map(updatedProfiles.map(profile => [profile._id, profile])).values());

            setStatus(prevData => ({
                ...prevData,
                profiles: uniqueProfiles,
                totalPages: Math.ceil(result.data.total / 20),
                notFound: uniqueProfiles.length === 0,
            }));
        } else {
            setStatus((prev) => ({
                ...prev,
                errorMessage: result.message,
                showErrorModal: true,
                loading: false
            }));
        }
        setStatus((prevState) => ({ ...prevState, loading: false }));
    }, [page, searchParams, accesstoken, userId, location.pathname, defaultProfilePicture]);

    const handleFollowAndUnFollowClick = async (profileId, isFollowing, unfollow) => {

        setStatus((prevState) => ({ ...prevState, loading: true, showErrorModal: false }));

        const followAction = !isFollowing;
        const unfollowBody = unfollow ? unfollow : location.pathname === constant.routes.followers;

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
            setStatus((prev) => ({
                ...prev,
                successMessage: result.data.message,
                showSnackbar: true
            }));
            setTimeout(() => window.location.reload(), 1000);
        } else {
            setStatus((prev) => ({
                ...prev,
                errorMessage: result.message,
                showErrorModal: true,
                loading: false
            }));
        }
        setStatus((prevState) => ({ ...prevState, loading: false }));
    };

    useScrollPagination(initialSearchParams, setStatus, fetchProfiles, loading, totalPages, page, mainContentRef);

    const handleSearchChange = useCallback((e) => {
        handleInputChange(e, setStatus);
    }, []);
    
    const handleErrorModalClose = () => handleModalClose(setStatus);

    return (
        <div className={`${styles.profileList} ${styles.scrollContainer}`} ref={mainContentRef}>
            <SearchFilterBar
                searchParams={searchParams}
                handleSearchChange={handleSearchChange}
                uniquePrepTimes={[]}
                uniqueCookTimes={[]}
                placeholder={constant.searchLabel.user}
            />

            <section className={styles.profileList}>
                {loading ? (
                    <Loader />
                ) : notFound ? (
                    <p className={styles.noDataMessage}>{constant.label.noProfileFound}</p>
                ) : status.profiles.length > 0 ? (
                    status.profiles.map(profile => (
                        <article key={profile._id} className={styles.profileCard}>
                            <div className={styles.profileInfo}>
                                <img
                                    src={profile.profileImage}
                                    alt={profile.name}
                                    className={styles.profileImage}
                                />
                                <div className={styles.textContainer}>
                                    <h2>{profile.name}</h2>
                                </div>
                            </div>
                            {location.pathname === constant.routes.users ? (
                                <div className={styles.followButtonContainer}>
                                    {profile.unfollow && profile.followback && !profile.follow && (
                                        <>
                                            <button
                                                className={styles.button}
                                                onClick={() => handleFollowAndUnFollowClick(profile._id, true, true)}
                                            >
                                                <span className={styles.buttonText}>{constant.label.unfollow}</span>
                                            </button>
                                            <button
                                                className={styles.button}
                                                onClick={() => handleFollowAndUnFollowClick(profile._id, false)}
                                            >
                                                <span className={styles.buttonText}>{constant.label.followBack}</span>
                                            </button>
                                        </>
                                    )}

                                    {profile.unfollow && !profile.followback && !profile.follow && (
                                        <button
                                            className={styles.button}
                                            onClick={() => handleFollowAndUnFollowClick(profile._id, true)}
                                        >
                                            <span className={styles.buttonText}>{constant.label.unfollow}</span>
                                        </button>
                                    )}

                                    {!profile.unfollow && !profile.followback && profile.follow && (
                                        <button
                                            className={styles.button}
                                            onClick={() => handleFollowAndUnFollowClick(profile._id, false)}
                                        >
                                            <span className={styles.buttonText}>{constant.label.follow}</span>
                                        </button>
                                    )}
                                </div>
                            ) : (location.pathname === constant.routes.following || location.pathname === constant.routes.followers) && (
                                <button
                                    className={styles.button}
                                    onClick={() => handleFollowAndUnFollowClick(profile._id, true)}
                                >
                                    <span className={styles.buttonText}>{constant.label.unfollow}</span>
                                </button>
                            )}
                        </article>
                    ))
                ) : (
                    <p className={styles.noDataMessage}>{constant.label.noProfileFound}</p>
                )}
            </section>
            {showErrorModal && <ErrorModal message={errorMessage} onClose={handleErrorModalClose} />}
            <Snackbar
                message={successMessage}
                isVisible={showSnackbar}
                onClose={() => setStatus((prev) => ({ ...prev, showSnackbar: false }))}
            />
        </div>
    );
};

export default withAuthentication(ProfileList);