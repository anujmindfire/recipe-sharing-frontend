import React from 'react';
import { Input } from 'antd';
import { InputFieldProps } from '../types/types';

const InputField: React.FC<InputFieldProps> = ({
    id,
    label,
    type = 'text',
    value,
    onChange,
    onBlur,
    name,
    disabled = false,
    placeholder,
    tabIndex
}) => {
    return (
        <div className='relative flex flex-col gap-2'>
            {label && <label htmlFor={id} className='text-gray-200'>{label}</label>}
            <Input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={`rounded-lg p-3 w-full text-base bg-gray-900 text-white border border-gray-600
                    focus:bg-gray-900 focus:text-white focus:border-blue-400
                    hover:bg-gray-900 hover:text-white placeholder-white
                    ${disabled ? 'bg-gray-800 cursor-not-allowed' : ''}`}
                disabled={disabled}
                placeholder={placeholder}
                style={{ height: '48px', color: 'white' }} 
                tabIndex={tabIndex}
            />
        </div>
    );
};

export default InputField;
