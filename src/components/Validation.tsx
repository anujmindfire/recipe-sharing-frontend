import { FC } from 'react';
import { Alert } from 'antd';
import { ValidationProps } from '../types/types';

const Validation: FC<ValidationProps> = ({ error, show }) => {
    return show && error ? (
        <div className='flex items-center mt-[-5px] text-red-600'>
            <span className='mr-2 mt-1 text-red-600' style={{ fontSize: '1em' }}>⚠️</span>
            <Alert 
                message={error} 
                type='error' 
                showIcon={false}
                style={{ 
                    backgroundColor: 'transparent',
                    color: '#ff4d4f',
                    padding: '0',
                    border: 'none'
                }}
                className='text-sm flex-grow'
            />
        </div>
    ) : null;
};

export default Validation;
