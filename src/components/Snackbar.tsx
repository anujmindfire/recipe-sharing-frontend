import React, { useEffect } from 'react';
import { notification } from 'antd';

interface SnackbarProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            notification.config({
                top: 80,
            });

            notification.success({
                message: 'Success',
                description: message,
                duration: 2,
                onClose,
            });
        }
    }, [isVisible, message, onClose]);

    return null;
};

export default Snackbar;
