import React from 'react';
import { ModalProps } from '../types/types';

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, children }) => {
    if (!isVisible) return null;

    return (
        <div
            className='fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center p-5 z-50'
            onClick={onClose}
        >
            <div
                className='bg-gray-800 w-full max-w-md max-h-[70vh] rounded-lg relative overflow-y-auto'
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className='absolute top-2 right-2 text-white text-2xl font-semibold border-none cursor-pointer'
                    onClick={onClose}
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
