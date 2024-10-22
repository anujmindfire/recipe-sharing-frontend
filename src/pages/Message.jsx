import React, { useState, useEffect, useCallback } from 'react';
import styles from '../styles/Message.module.css';
import Loader from '../components/Loader';
import io from 'socket.io-client';
import constant from '../utils/constant';
import { apiService } from '../apiService/Services.js';

const Message = ({ sender, receiver, receiverName }) => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const accesstoken = localStorage.getItem(constant.localStorageKeys.accessToken);
    const userId = localStorage.getItem(constant.localStorageKeys.userId);

    useEffect(() => {
        const socket = io(process.env.REACT_APP_SOCKET_IO_CONNECTION_URL);

        socket.on(constant.label.connect, () => {
            if (userId) {
                socket.emit(constant.label.join, userId);
            }
        });

        socket.on(constant.apiLabel.message, (newMessage) => {
            if (newMessage && (newMessage.receiver === receiver || newMessage.sender === receiver)) {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        });

        return () => {
            socket.off(constant.apiLabel.message);
        };
    }, [receiver, userId]);

    const fetchMessages = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');
        const payload = { sender, receiver, accesstoken, userId }
        
        const result = await apiService(payload, constant.apiLabel.getChat)

        if (result.success) {
            setMessages(Array.isArray(result.data.data) ? result.data.data : []);
        } else {
            setErrorMessage(result.message);
        }
        setIsLoading(false);
    }, [sender, receiver, accesstoken, userId]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const sendMessage = async (messageContent) => {
        const currentTime = new Date().toISOString();
        const newMessage = {
            content: messageContent,
            createdAt: currentTime,
            sender: userId,
            receiver: receiver,
            accesstoken,
            userId
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);

        const result = await apiService(newMessage, constant.apiLabel.message);
        if (!result.success) {
            setMessages((prevMessages) => prevMessages.filter(msg => msg.createdAt !== currentTime));
        }
    };

    const InputField = () => {
        const [messageText, setMessageText] = useState('');

        const handleSubmit = (e) => {
            e.preventDefault();
            if (messageText.trim()) {
                sendMessage(messageText);
                setMessageText('');
            }
        };

        return (
            <form className={styles.inputContainer} onSubmit={handleSubmit}>
                <div className={styles.inputWrapper}>
                    <div className={styles.inputField}>
                        <input
                            type={constant.inputLabel.messageInput.type}
                            id={constant.inputLabel.messageInput.id}
                            className={styles.textInput}
                            placeholder={constant.inputLabel.messageInput.placeHolder}
                            aria-label={constant.inputLabel.messageInput.placeHolder}
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                        />
                        <div className={styles.buttonWrapper}>
                            <div className={styles.buttonContainer}>
                                <button type={constant.buttonType.submit} className={styles.sendButton}>
                                    <span className={styles.sendButtonText}>{constant.label.send}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return !isNaN(date.getTime())
            ? date.toLocaleString(undefined, { hour: constant.label.digit, minute: constant.label.digit })
            : constant.validationMessage.invalidDate;
    };

    return (
        <main className={styles.chatContainer}>
            <header className={styles.header}>
                <h3 className={styles.headerTitle}>{receiverName}</h3>
            </header>
            <div className={styles.messagesContainer}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`${styles.messageBubble} ${message.sender === userId ? styles.sent : styles.received}`}
                    >
                        <p>{message.content}</p>
                        <span className={styles.timestamp}>
                            {formatDate(message.createdAt)}
                        </span>
                    </div>
                ))}
                {isLoading && <Loader />}
            </div>
            <InputField />
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        </main>
    );
};

export default Message;
