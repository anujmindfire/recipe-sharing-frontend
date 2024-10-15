import React from 'react';
import styles from '../styles/Input.module.css';

const InputField = ({ id, label, type, value, onChange, onBlur, name, disabled, placeholder }) => {
    return (
        <div className={styles.inputContainer}>
            {label && <label htmlFor={id} className={styles.label}>{label}</label>}
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={styles.input}
                required
                disabled={disabled}
                placeholder={placeholder}
            />
        </div>
    );
};

export default InputField;
