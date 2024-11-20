import Loader from '../../components/Loader';
import ErrorBoundary from '../../components/ErrorBoundary';
import constant, { buttonType } from '../../utils/constant';
import io from 'socket.io-client';
import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/redux/store';
import { setMessage, setLoading, setErrorMessage } from '../../store/context/messageSlice';
import { apiService } from '../../apiService/service';
import { MessageStateProps, MessageProps } from '../../types/types';

const Message: React.FC<MessageStateProps> = ({ sender, receiver, receiverName }) => {
    const dispatch = useDispatch();
    const { messages, loading, errorMessage } = useSelector((state: RootState) => state.message);

    const accesstoken = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.accessToken) : null;
    const userId = typeof window !== 'undefined' ? localStorage.getItem(constant.localStorageKeys.userId) : null;

    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_CONNECTION_URL);

        socket.on(constant.label.connect, () => {
            if (userId) {
                socket.emit(constant.label.join, userId);
            }
        });

        socket.on(constant.apiLabel.message, (newMessage) => {
            if (newMessage && (newMessage.receiver === receiver || newMessage.sender === receiver)) {
                console.log('message', messages);
                console.log('newMessage', newMessage);
                dispatch(setMessage((prevMessages) => [...prevMessages, newMessage]));
            }
        });

        return () => {
            socket.off(constant.apiLabel.message);
        };
    }, [receiver, userId]);

    const fetchMessages = useCallback(async () => {
        dispatch(setLoading(true));
        dispatch(setErrorMessage(''));

        const payload = { sender, receiver, accesstoken, userId }

        const result = await apiService(payload, constant.apiLabel.getChat)

        if (result.success) {
            dispatch(setMessage(result.data.data))
        } else {
            dispatch(setErrorMessage(result.message));
        }
        dispatch(setLoading(false));
    }, [sender, receiver, accesstoken, userId]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const sendMessage = async (messageContent: string) => {
        const currentTime = new Date().toISOString();

        const newMessage: MessageProps = {
            content: messageContent,
            createdAt: currentTime,
            sender: userId,
            receiver: receiver,
            accesstoken,
            userId
        };

        dispatch(setMessage((prevMessages) => [...prevMessages, newMessage]));

        const result = await apiService(newMessage, constant.apiLabel.message);
        if (!result.success) {
            dispatch(setMessage((prevMessages) => prevMessages.filter(msg => msg.createdAt !== currentTime)));
        }
    };

    const InputField = () => {
        const [messageText, setMessageText] = useState('');

        const handleSubmit = (e: FormEvent) => {
            e.preventDefault();
            if (messageText.trim()) {
                sendMessage(messageText);
                setMessageText('');
            }
        };

        return (
            <form className='flex w-full items-center gap-3 justify-start p-3 mb-12' onSubmit={handleSubmit}>
                <div className='flex flex-1'>
                    <div className='flex w-full gap-2'>
                        <input
                            type={constant.inputLabel.messageInput.type}
                            id={constant.inputLabel.messageInput.id}
                            className='flex-1 rounded-lg bg-gray-100 p-2.5 text-base font-medium text-gray-700 border border-gray-300 transition-all duration-200'
                            placeholder={constant.inputLabel.messageInput.placeHolder}
                            aria-label={constant.inputLabel.messageInput.placeHolder}
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                        />
                        <div className='flex items-center'>
                            <button type={buttonType.submit} className='rounded-lg bg-blue-600 text-white py-2.5 px-4 font-medium transition-all duration-200 hover:bg-blue-500'>
                                <span className='font-semibold'>{constant.label.send}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return !isNaN(date.getTime())
            ? date.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' })
            : constant.validationMessage.invalidDate;
    };

    return (
        <ErrorBoundary>
            <main className='flex flex-col h-screen'>
                <header className='p-4 border-b border-white flex justify-center items-center mt-[-70px]'>
                    <h3 className='mt-[100px] text-xl text-white'>{receiverName}</h3>
                </header>
                <div className='flex-1 overflow-y-auto p-4'>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`${message.sender === userId ? 'bg-green-100 self-end ml-auto' : 'bg-gray-200 self-start mr-auto'
                                } rounded-lg p-2.5 mb-2 max-w-[60%] break-words`}
                        >
                            <p>{message.content}</p>
                            <span className='text-xs text-gray-500 block'>{formatDate(message.createdAt)}</span>
                        </div>
                    ))}
                    {loading && <Loader />}
                </div>
                <InputField />
                {errorMessage && <div className='text-red-500'>{errorMessage}</div>}
            </main>
        </ErrorBoundary>
    )
}

export default Message;