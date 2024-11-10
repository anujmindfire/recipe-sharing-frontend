import React from 'react';
import constant from '../utils/constant';
import { Modal, Button } from 'antd';
import { ErrorModalProps } from '../interface/Interface';

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
