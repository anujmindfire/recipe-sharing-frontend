import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import ErrorModal from './ErrorModal';
import Loader from './Loader';
import Notification from '../components/Notification';
import { io } from 'socket.io-client';
import constant from '../utils/constant';
import { apiService } from '../apiService/Services';
import { clearLocalStorage } from '../utils/tokenServices'

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [status, setStatus] = useState({
        isLoggedIn: false,
        showDropdown: false,
        name: '',
        loading: false,
        errorMessage: '',
        showErrorModal: false,
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const token = constant.localStorageUtils.getItem(constant.localStorageKeys.accessToken);
        const storedName = constant.localStorageUtils.getItem(constant.localStorageKeys.userName);
        setStatus((prevState) => ({
            ...prevState,
            isLoggedIn: !!token,
            name: storedName,
        }));
    }, [location.pathname]);

    useEffect(() => {
        const socket = io(process.env.REACT_APP_SOCKET_IO_CONNECTION_URL);

        socket.on(constant.label.connect, () => {
            const userId = constant.localStorageUtils.getItem(constant.localStorageKeys.userId)
            if (userId) {
                socket.emit(constant.label.join, userId);
            }
        });

        socket.on(constant.label.noti, (data) => {
            if (data.message) {
                setNotifications((prevNotifications) => [
                    ...prevNotifications,
                    { title: constant.label.followTitle, message: data.message },
                ]);
                setUnreadCount((prevCount) => prevCount + 1);
            }
        });

        socket.on(constant.label.messageNoti, (data) => {
            if (data.notification) {
                setNotifications((prevNotifications) => [
                    ...prevNotifications,
                    { title: constant.label.messageTitle, message: data.notification },
                ]);
                setUnreadCount((prevCount) => prevCount + 1);
            }
        });

        return () => {
            socket.off(constant.label.noti);
            socket.off(constant.label.messageNoti);
            socket.disconnect();
        };
    }, []);

    const handleLogout = async () => {
        const payload = {
            accesstoken: constant.localStorageUtils.getItem(constant.localStorageKeys.accessToken),
            refreshtoken: constant.localStorageUtils.getItem(constant.localStorageKeys.refreshToken),
            userId: constant.localStorageUtils.getItem(constant.localStorageKeys.userId)
        }

        setStatus((prevState) => ({ ...prevState, loading: true }));
        const result = await apiService(payload, constant.apiLabel.logout);
        navigate(constant.routes.signIn);
        if (result.success) {
            setStatus((prevState) => ({
                ...prevState,
                isLoggedIn: false,
            }));
            clearLocalStorage();
        } else {
            setStatus(prev => ({ ...prev, errorMessage: result.message, showErrorModal: true }));
        }

        setStatus(prev => ({ ...prev, loading: false }));
    };

    const handleLogoClick = () => {
        navigate(status.isLoggedIn ? constant.routes.recipes : constant.routes.signIn);
    };

    const toggleDropdown = () => {
        setStatus((prevState) => ({ ...prevState, showDropdown: !prevState.showDropdown }));
    };

    const closeDropdown = () => {
        setStatus((prevState) => ({ ...prevState, showDropdown: false }));
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
        if (isSidebarOpen) {
            setUnreadCount(0);
        }
    };

    const handleDeleteNotification = (index) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((_, i) => i !== index)
        );
    };

    return (
        <>
            <header className={styles.header}>
                <div className={styles.logo} onClick={handleLogoClick}>
                    <img
                        loading='lazy'
                        src={constant.imageLink.logoIcon}
                        className={styles.logoImage}
                        alt={constant.imageAlt.imageAlt}
                    />
                    <h1 className={styles.logoText}>{constant.label.logoText}</h1>
                </div>

                {status.isLoggedIn && (
                    <nav className={styles.navLinks}>
                        <Link to={constant.routes.recipes} className={styles.navLink}>{constant.label.recipes}</Link>
                    </nav>
                )}

                <nav className={styles.authButtons}>
                    {status.isLoggedIn && (
                        <div className={styles.profileMenu}>
                            <button className={styles.iconButton} aria-label='Notifications' onClick={toggleSidebar}>
                                <img
                                    src={constant.imageLink.notificationIcon}
                                    alt={constant.label.notification}
                                    className={styles.notificationIcon}
                                />
                                {unreadCount > 0 && (
                                    <span className={styles.notificationDot}></span>
                                )}
                            </button>
                            <Notification
                                isOpen={isSidebarOpen}
                                onClose={toggleSidebar}
                                initialNotifications={notifications}
                                onDeleteNotification={handleDeleteNotification}
                            />
                            <div className={styles.profileCircle} onClick={toggleDropdown}>
                                {status.name.charAt(0).toUpperCase()}
                            </div>
                            {status.showDropdown && (
                                <div className={styles.dropdownMenu}>
                                    <Link to={constant.routes.myRecipe} className={styles.dropdownItem} onClick={closeDropdown}>
                                        <FontAwesomeIcon icon={faCircleUser} style={{ marginRight: '10px' }} />
                                        {constant.label.profile}
                                    </Link>
                                    <div className={styles.logoutContainer}>
                                        <button className={styles.logoutButton} onClick={() => { handleLogout(); closeDropdown(); }}>
                                            <FontAwesomeIcon icon={faRightFromBracket} />
                                            <span>{constant.label.logout}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </nav>
            </header>

            {status.loading && <Loader />}

            {status.showErrorModal && (
                <ErrorModal
                    message={status.errorMessage}
                    onClose={() => {
                        setStatus((prevState) => ({ ...prevState, showErrorModal: false, errorMessage: '' }));
                    }}
                />
            )}
        </>
    );
};

export default Header;
