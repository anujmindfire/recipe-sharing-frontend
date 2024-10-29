import React from 'react';
import styles from '../styles/Button.module.css';
import { Spinner } from '@chakra-ui/react';

const Button = ({ children, onClick, type, className, loading, tabIndex }) => {
    return (
        <button
            type={type}
            className={`${styles.submitButton} ${className}`}
            onClick={onClick}
            disabled={loading}
            tabIndex={tabIndex}
        >
            {loading ? <Spinner size='sm' /> : children}
        </button>
    );
};

export default Button;
