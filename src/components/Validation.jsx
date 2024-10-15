import React from 'react';
import styles from '../styles/Validation.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

const Validation = ({ error, show }) => {
    return show && error ? (
        <div className={styles.validationWrapper}>
            <FontAwesomeIcon icon={faCircleExclamation} className={styles.validationIcon} />
            <p className={styles.validationError}>{error}</p>
        </div>
    ) : null;
};

export default Validation;
