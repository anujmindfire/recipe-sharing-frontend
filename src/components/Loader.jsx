import React from 'react';
import styles from '../styles/Loader.module.css';
import constant from '../utils/constant';

const Loader = () => {
    return (
        <div className={styles.loaderContainer}>
            <img
                src={constant.imageLink.loader}
                alt={constant.imageAlt.loading}
                className={styles.spinner}
            />
        </div>
    );
};

export default Loader;
