import React from 'react';
import { buttonType } from '../utils/constant';
import { Button as AntButton } from 'antd';
import { ButtonProps } from '../interface/Interface';

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
