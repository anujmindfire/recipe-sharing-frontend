import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from '../styles/ChatSidebar.module.css';
import Loader from '../components/Loader';
import SearchFilterBar from '../components/SearchFilterBar';
import Message from '../pages/Message';
import withAuthentication from '../utils/withAuthenicate';
import { apiService } from '../apiService/Services.js';
import constant from '../utils/constant.js';
import { handleInputChange, handleModalClose } from '../utils/commonFunction.js';
import ErrorModal from '../components/ErrorModal.jsx';

const ChatSidebar = () => {
    const [status, setStatus] = useState({
        profiles: [],
        totalPages: 0,
        page: 1,
        loading: false,
        errorMessage: '',
        showErrorModal: false,
        searchParams: { query: '' },
        notFound: false,
    });
    const [selectedChatUser, setSelectedChatUser] = useState(null);

    const accesstoken = localStorage.getItem(constant.localStorageKeys.accessToken);
    const userId = localStorage.getItem(constant.localStorageKeys.userId);
    const defaultProfilePicture = constant.imageLink.profileIcon;
    const mainContentRef = useRef(null);

    const handleChatOpen = (user) => {
        setSelectedChatUser(user);
        constant.localStorageUtils.setItem(constant.localStorageKeys.selectedChatUserId, user._id);
    };

    const fetchProfiles = useCallback(async () => {
        setStatus((prevState) => ({ ...prevState, loading: true, showErrorModal: false }));

        const { query } = status.searchParams;

        const payload = {
            pathMap: { allUser: true },
            accesstoken,
            userId,
            page: status.page,
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
    }, [status.page, status.searchParams, accesstoken, userId, defaultProfilePicture]);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    const handleScroll = useCallback(() => {
        if (mainContentRef.current) {
            const bottom = mainContentRef.current.scrollHeight - mainContentRef.current.scrollTop <= mainContentRef.current.clientHeight + 1;
            if (bottom && !status.loading && status.page < status.totalPages) {
                setStatus((prev) => ({ ...prev, page: prev.page + 1 }));
            }
        }
    }, [status.loading, status.page, status.totalPages]);

    useEffect(() => {
        const contentRef = mainContentRef.current;
        if (contentRef) {
            contentRef.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (contentRef) {
                contentRef.removeEventListener('scroll', handleScroll);
            }
        };
    }, [handleScroll]);

    const handleSearchChange = useCallback((e) => {
        handleInputChange(e, setStatus);
    }, []);

    const handleErrorModalClose = () => handleModalClose(setStatus);

    useEffect(() => {
        document.body.style.overflow = constant.label.hidden;

        const storedChatUserId = localStorage.getItem(constant.localStorageKeys.selectedChatUserId);
        if (storedChatUserId) {
            const storedChatUser = status.profiles.find(user => user._id === storedChatUserId);
            if (storedChatUser) {
                setSelectedChatUser(storedChatUser);
            }
        }

        return () => {
            document.body.style.overflow = constant.label.auto;
        };
    }, [status.profiles]);

    return (
        <div className={styles.chatContainer}>
            <aside className={`${styles.sidebar} ${styles.scrollContainer}`} ref={mainContentRef}>
                <SearchFilterBar
                    searchParams={status.searchParams}
                    handleSearchChange={handleSearchChange}
                    placeholder={constant.searchLabel.user}
                />
                <nav>
                    <ul>
                        {status.loading ? (
                            <Loader />
                        ) : status.notFound ? (
                            <p className={styles.noDataMessage}>{constant.label.noProfileFound}</p>
                        ) : status.profiles && status.profiles.length > 0 ? (
                            status.profiles.map((user) => (
                                <li key={user._id} className={styles.userListItem}>
                                    <div className={styles.userInfo}>
                                        <img
                                            loading='lazy'
                                            src={defaultProfilePicture}
                                            className={styles.userAvatar}
                                            alt={`${user.name}'s avatar`}
                                        />
                                        <div className={styles.userName}>{user.name}</div>
                                    </div>
                                    <div className={styles.userActionWrapper}>
                                        <button
                                            className={styles.userActionButton}
                                            aria-label={`Chat with ${user.name}`}
                                            onClick={() => handleChatOpen(user)}
                                        >
                                            <img
                                                loading='lazy'
                                                src={constant.imageLink.chatIcon}
                                                className={styles.icon}
                                                alt={constant.imageAlt.chaticons}
                                            />
                                        </button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className={styles.noDataMessage}>{constant.label.noProfileFound}</p>
                        )}
                    </ul>
                </nav>
            </aside>

            {status.showErrorModal && <ErrorModal message={status.errorMessage} onClose={handleErrorModalClose} />}

            {selectedChatUser && (
                <div className={styles.chatWindow}>
                    <Message sender={userId} receiver={selectedChatUser._id} receiverName={selectedChatUser.name}/>
                </div>
            )}
        </div>
    );
}

export default withAuthentication(ChatSidebar);
