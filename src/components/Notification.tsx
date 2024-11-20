import React from 'react';
import constant from '../utils/constant';
import { DeleteOutlined } from '@ant-design/icons';
import { NotificationCompProps } from '../types/types';

const Notification: React.FC<NotificationCompProps> = ({
    isOpen,
    onClose,
    initialNotifications = [],
    onDeleteNotification,
}) => {
    return (
        <div
            className={`fixed top-0 right-0 w-72 h-full bg-gray-800 shadow-lg transition-transform transform ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            } z-50`}
        >
            <div className='flex justify-between items-center p-4 border-b border-gray-700 text-white'>
                <h2>{constant.label.notification}</h2>
                <button className='text-2xl' onClick={onClose}>
                    &times;
                </button>
            </div>
            <div className='p-4 max-h-[calc(100%-50px)] overflow-y-auto'>
                {initialNotifications.length > 0 ? (
                    initialNotifications.map((notification, index) => (
                        <div key={index} className='flex justify-between items-center py-2 border-b border-gray-700'>
                            <div className='flex-1'>
                                <h3 className='text-base text-white'>{notification.title}</h3>
                                <p className='text-gray-400'>{notification.message}</p>
                            </div>
                            <button
                                className='text-white hover:text-red-500'
                                onClick={() => onDeleteNotification(index)}
                                aria-label={constant.label.deleteNoti}
                            >
                                <DeleteOutlined/>
                            </button>
                        </div>
                    ))
                ) : (
                    <p className='text-gray-400 text-center'>{constant.label.noAvailNoti}</p>
                )}
            </div>
        </div>
    );
};

export default Notification;
