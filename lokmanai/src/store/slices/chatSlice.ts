import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  responseId?: string; // Response ID for follow-up messages
  isStreaming?: boolean; // Indicates if message is still being streamed
}

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  streamingMessageId: string | null; // ID of currently streaming message
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
  streamingMessageId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    startStreamingMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      state.streamingMessageId = action.payload.id;
    },
    updateStreamingMessage: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const message = state.messages.find(msg => msg.id === action.payload.id);
      if (message) {
        message.content += action.payload.content;
      }
    },
    finishStreamingMessage: (state, action: PayloadAction<{ id: string; responseId: string }>) => {
      const message = state.messages.find(msg => msg.id === action.payload.id);
      if (message) {
        message.isStreaming = false;
        message.responseId = action.payload.responseId;
      }
      state.streamingMessageId = null;
    },
  },
});

export const { 
  addMessage, 
  setLoading, 
  setError, 
  clearMessages, 
  clearError,
  startStreamingMessage,
  updateStreamingMessage,
  finishStreamingMessage
} = chatSlice.actions;
export default chatSlice.reducer;
