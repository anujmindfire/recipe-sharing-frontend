import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/Sidebar.module.css';
import withAuthentication from '../utils/withAuthenicate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import constant from '../utils/constant';

const Sidebar = () => {
    const [isToggleOpen, setIsToggleOpen] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { icon: constant.imageLink.addRecipe, label: constant.label.addRecipe, path: constant.routes.addRecipe },
        { icon: constant.imageLink.myRecipe, label: constant.label.myRecipe, path: constant.routes.myRecipe },
        { icon: constant.imageLink.myFavo, label: constant.label.myFavo, path: constant.routes.myFavo },
        { icon: constant.imageLink.following, label: constant.label.following, path: constant.routes.following },
        { icon: constant.imageLink.followers, label: constant.label.followers, path: constant.routes.followers },
        { icon: constant.imageLink.editProfile, label: constant.label.editProfile, path: constant.routes.editProfile },
        { icon: constant.imageLink.users, label: constant.label.users, path: constant.routes.users },
        { icon: constant.imageLink.chat, label: constant.label.chat, path: constant.routes.chat }
    ];

    const toggleSidebar = () => {
        setIsToggleOpen(prevState => !prevState);
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
        <nav className={`${styles.sidebar} ${(!isToggleOpen && !isMenuOpen) ? styles.closed : ''} ${isToggleOpen ? styles.open : ''}`}>
            <div className={styles.menuToggle} onClick={toggleSidebar}>
                <div className={styles.menuToggleIcon}>
                    <FontAwesomeIcon icon={faBars} size='lg' />
                </div>
            </div>

            <nav
                className={styles.sidebarMenu}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                to={item.path}
                                className={`${styles.menuItem} ${location.pathname === item.path ? styles.active : ''}`}
                            >
                                <img src={item.icon} alt={item.label} className={styles.menuIcon} />
                                {(isToggleOpen || isMenuOpen) && <span>{item.label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </nav>
    );
};

export default withAuthentication(Sidebar);
