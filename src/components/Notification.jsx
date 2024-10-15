import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Notification.module.css';

const Notification = ({ isOpen, onClose, initialNotifications = [], onDeleteNotification }) => {
    return (
        <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <div className={styles.sidebarHeader}>
                <h2>Notifications</h2>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
            </div>
            <div className={styles.notificationList}>
                {initialNotifications.length > 0 ? (
                    initialNotifications.map((notification, index) => (
                        <div key={index} className={styles.notificationItem}>
                            <div className={styles.notificationContent}>
                                <h3 className={styles.notificationTitle}>{notification.title}</h3>
                                <p className={styles.notificationMessage}>{notification.message}</p>
                            </div>
                            <button 
                                className={styles.deleteButton}
                                onClick={() => onDeleteNotification(index)}
                                aria-label='Delete Notification'
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className={styles.noNotifications}>No notifications available.</p>
                )}
            </div>
        </div>
    );
};

export default Notification;