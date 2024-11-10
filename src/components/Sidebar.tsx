import { useState } from 'react';
import { useRouter } from 'next/router';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Link from 'next/link';
import authenicateRoute from '../utils/authenticatedRouteGuard';
import constant from '../utils/constant';
import { MenuItem } from '../interface/Interface';

const Sidebar = () => {
    const [isToggleOpen, setIsToggleOpen] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    const menuItems: MenuItem[] = [
        { icon: constant.imageLink.myRecipe, label: constant.label.myRecipe, path: constant.routes.myRecipe },
        { icon: constant.imageLink.myFavo, label: constant.label.myFavo, path: constant.routes.myFavo },
        { icon: constant.imageLink.following, label: constant.label.following, path: constant.routes.following },
        { icon: constant.imageLink.followers, label: constant.label.followers, path: constant.routes.followers },
        { icon: constant.imageLink.editProfile, label: constant.label.editProfile, path: constant.routes.editProfile },
        { icon: constant.imageLink.users, label: constant.label.users, path: constant.routes.users },
        { icon: constant.imageLink.chat, label: constant.label.chat, path: constant.routes.chat },
    ];

    const toggleSidebar = () => {
        setIsToggleOpen((prevState) => !prevState);
    };

    const handleMouseEnter = () => {
        if (!isToggleOpen) {
            setIsMenuOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isToggleOpen) {
            setIsMenuOpen(false);
        }
    };

    return (
        <nav
            className={`flex flex-col h-full transition-all duration-300 ease-in-out ${
                isToggleOpen ? 'w-64' : 'w-20'
            } mt-20`}
        >
            <div className='flex justify-start items-center p-4 cursor-pointer ml-3' onClick={toggleSidebar}>
                {isToggleOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            </div>

            <nav
                className='flex-grow overflow-y-auto'
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <ul className='list-none p-0 m-0'>
                    {menuItems.map((item, index) => (
                        <li key={index} className='py-0'>
                            <Link
                                href={item.path}
                                className={`flex items-center gap-4 p-3 text-white transition-all duration-300 ${
                                    isToggleOpen || isMenuOpen ? 'pl-6' : 'justify-center pl-4'
                                } ${item.path === router.pathname ? 'bg-gray-700' : ''}`}
                            >
                                <img
                                    src={item.icon}
                                    alt={item.label}
                                    className='w-6 h-6 filter brightness-0 invert'
                                />
                                {(isToggleOpen || isMenuOpen) && <span>{item.label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </nav>
    );
};

export default authenicateRoute(Sidebar);
