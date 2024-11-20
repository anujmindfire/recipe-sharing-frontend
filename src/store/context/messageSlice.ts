import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageProps, ChatStateProps } from '../../types/types';

const initialState: ChatStateProps = {
    messages: [],
    loading: false,
    errorMessage: '',
};

const messageSlice = createSlice({
    name: 'messageSlice',
    initialState,
    reducers: {
        setMessage: (state, action: PayloadAction<MessageProps[] | ((prevMessages: MessageProps[]) => MessageProps[])>) => {
            if (typeof action.payload === 'function') {
                state.messages = action.payload(state.messages);
            } else {
                state.messages = action.payload;
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setErrorMessage: (state, action: PayloadAction<string>) => {
            state.errorMessage = action.payload;
        },
    },
});

export const {
    setMessage,
    setLoading,
    setErrorMessage,
} = messageSlice.actions;

export default messageSlice.reducer;
