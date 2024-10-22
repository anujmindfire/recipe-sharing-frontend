import React from 'react';
import styles from '../styles/ErrorModal.module.css';
import Button from './Button';
import constant from '../utils/constant';

const ErrorModal = ({ message, onClose }) => {
    return (
        <div className={styles.errorModal}>
            <div className={styles.errorContent}>
                <h1>{constant.label.errorModalHeading}</h1>
                <p>{message}</p>
                <Button onClick={onClose}>{constant.label.closeLabel}</Button>
            </div>
        </div>
    );
};

export default ErrorModal;
