import React from 'react';
import constant from '../utils/constant';
import { Modal, Button } from 'antd';
import { ErrorModalProps } from '../types/types';

/**
 * ErrorModal component that displays an error message in a modal.
 * It provides a close button for the user to dismiss the modal.
 * 
 * @param {ErrorModalProps} props - The props for the modal, including the error message and the onClose callback function.
 * @returns {React.FC} A modal displaying the error message, with a close button to dismiss it.
 */

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
    return (
        <Modal
            title={constant.label.errorModalHeading}
            open={true}
            onCancel={onClose}
            footer={[
                <Button key='close' type='primary' onClick={onClose}>
                    {constant.label.closeLabel}
                </Button>,
            ]}
            width={400}
        >
            <p>{message}</p>
        </Modal>
    );
};

export default ErrorModal;
