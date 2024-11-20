import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ErrorModal from './ErrorModal';
import Loader from './Loader';
import Notification from './Notification';
import constant from '../utils/constant';
import { useRouter } from 'next/router';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { io, Socket } from 'socket.io-client';
import { apiService } from '../apiService/service';
import { HeaderProps, NotificationProps } from '../types/types';
import { clearLocalStorage } from '../utils/tokenRefresher';

/**
 * Header component displaying the top navigation bar with user information,
 * notifications, and authentication status. Includes socket connection for real-time notifications.
 * 
 * Handles user login/logout, shows the notifications sidebar, and displays an error modal if there is an issue.
 * 
 * @returns {React.FC} A header with user information, a logo, navigation links, and a dropdown menu with user actions.
 */

const Header: React.FC = () => {
    const router = useRouter();
    const [status, setStatus] = useState<HeaderProps>({
        isLoggedIn: false,
        showDropdown: false,
        name: '',
        loading: false,
        errorMessage: '',
        showErrorModal: false,
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<NotificationProps[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);

    useEffect(() => {
        const token = constant.localStorageUtils.getItem(constant.localStorageKeys.accessToken);
        const storedName = constant.localStorageUtils.getItem(constant.localStorageKeys.userName);

        setStatus((prevState) => ({
            ...prevState,
            isLoggedIn: !!token,
            name: storedName || '',
        }));
    }, []);

    useEffect(() => {
        const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_CONNECTION_URL);

        socket.on(constant.label.connect, () => {
            const userId = constant.localStorageUtils.getItem(constant.localStorageKeys.userId);
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
            userId: constant.localStorageUtils.getItem(constant.localStorageKeys.userId),
        };

        setStatus((prevState) => ({ ...prevState, loading: true }));
        const result = await apiService(payload, constant.apiLabel.logout);
        router.push(constant.routes.signIn);

        if (result.success) {
            setStatus((prevState) => ({
                ...prevState,
                isLoggedIn: false,
            }));
            clearLocalStorage();
        } else {
            setStatus((prev) => ({ ...prev, errorMessage: result.message, showErrorModal: true }));
        }

        setStatus((prev) => ({ ...prev, loading: false }));
    };

    const handleLogoClick = () => {
        router.push(status.isLoggedIn ? constant.routes.recipes : constant.routes.signIn);
    };

    const toggleDropdown = () => {
        setStatus((prevState) => ({ ...prevState, showDropdown: !prevState.showDropdown }));
    };

    const closeDropdown = () => {
        setStatus((prevState) => ({ ...prevState, showDropdown: false }));
    };

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
        if (isSidebarOpen) {
            setUnreadCount(0);
        }
    };

    const handleDeleteNotification = (index: number) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((_, i) => i !== index)
        );
    };

    return (
        <>
            <header className='flex items-center justify-between p-4 bg-gray-800 border-b border-gray-600 fixed w-full z-10'>
                <div className='flex items-center cursor-pointer' onClick={handleLogoClick}>
                    <img
                        loading='lazy'
                        src={constant.imageLink.logoIcon}
                        className='w-8 h-8 filter brightness-0 invert'
                        alt={constant.imageAlt.imageAlt}
                    />
                    <h1 className='text-white font-bold text-lg ml-2'>{constant.label.logoText}</h1>
                </div>

                {status.isLoggedIn && (
                    <nav className='flex space-x-4'>
                        <Link href={constant.routes.recipes} className='text-white'>
                            {constant.label.recipes}
                        </Link>
                    </nav>
                )}

                <nav className='flex items-center space-x-4'>
                    {status.isLoggedIn && (
                        <div className='flex items-center relative space-x-4'>
                            <button
                                className='flex items-center bg-gray-300 rounded-full p-2'
                                onClick={toggleSidebar}
                                aria-label='Notifications'>
                                <img
                                    src={constant.imageLink.notificationIcon}
                                    alt={constant.label.notification}
                                    className='w-5 h-5'
                                />
                                {unreadCount > 0 && (
                                    <span className='absolute -top-1 right-14 w-2 h-2 bg-red-500 rounded-full'></span>
                                )}
                            </button>
                            <Notification
                                isOpen={isSidebarOpen}
                                onClose={toggleSidebar}
                                initialNotifications={notifications}
                                onDeleteNotification={handleDeleteNotification}
                            />
                            <div className='relative inline-block'>
                                <div
                                    className='w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center cursor-pointer'
                                    onClick={toggleDropdown}
                                >
                                    {status.name.charAt(0).toUpperCase()}
                                </div>
                                {status.showDropdown && (
                                    <div className='absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md'>
                                        <Link href={constant.routes.myRecipe}>
                                            <div
                                                className='block px-4 py-2 text-gray-800 hover:bg-gray-100'
                                                onClick={closeDropdown}
                                            >
                                                <UserOutlined className='mr-2' />
                                                {constant.label.profile}
                                            </div>
                                        </Link>
                                        <div className='px-4 py-2'>
                                            <button
                                                className='flex items-center text-gray-800'
                                                onClick={() => { handleLogout(); closeDropdown(); }}
                                            >
                                                <LogoutOutlined className='mr-2' />
                                                {constant.label.logout}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
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
