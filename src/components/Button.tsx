import React from 'react';
import { buttonType } from '../utils/constant';
import { Button as AntButton } from 'antd';
import { ButtonProps } from '../interface/Interface';

/**
 * Custom Button component that wraps the Ant Design Button.
 * It provides additional customization options like button type, loading state, and custom styles.
 * 
 * @param {ButtonProps} props - The props for the button component, including children, onClick, type, className, loading, tabIndex, and other properties.
 * @returns {React.FC} A styled button component that utilizes Ant Design's Button.
 */

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = buttonType.submit,
    className = '',
    loading = false,
    tabIndex,
}) => {
    return (
        <AntButton
            type={type === buttonType.submit ? 'primary' : 'default'}
            className={`rounded-lg py-3 px-3 bg-purple-500 text-white w-full ${className}`}
            onClick={onClick}
            loading={loading}
            tabIndex={tabIndex}
            htmlType={type}
            style={{ height: '48px' }}
        >
            {children}
        </AntButton>
    );
};

export default Button;
