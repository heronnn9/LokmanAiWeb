import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CancelTokenSource } from 'axios';

interface AiRequest {
  user_text: string;
  previous_respond_id?: string;
}

interface AiResponse {
  response?: string;
  data?: unknown;
}

interface StreamingCallbacks {
  onToken: (data: string) => void;
  onDone: (responseId: string) => void;
  onError: (error: string) => void;
}

interface StreamingRequest {
  user_text: string;
  previous_respond_id?: string;
}

export const askApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.1.143:8000/',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    ask: builder.mutation<AiResponse, AiRequest>({
        query: (request) => ({
            url: 'ask',
            method: 'POST',
            body: request,
        }),
        transformResponse: (response: AiResponse) => {
            return response;
        },
    }),
  }),
});

export const { useAskMutation } = askApi;

// Streaming Chat Function
export const streamingChat = async (
  request: StreamingRequest,
  callbacks: StreamingCallbacks,
  cancelTokenSource: CancelTokenSource
) => {
  try {
    const response = await fetch('http://192.168.1.143:8000/ask/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let isDoneCallbackCalled = false;

    const readStream = async () => {
      try {
        while (true) {
          if (cancelTokenSource.token.reason) {
            reader.cancel();
            break;
          }

          const { done, value } = await reader.read();
          
          if (done) {
            if (!isDoneCallbackCalled) {
              callbacks.onDone('');
              isDoneCallbackCalled = true;
            }
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          // console.warn('🔥 CHUNK:', chunk);
          buffer += chunk;
          
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          
          let isTokenEvent = false;
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine === '') continue;
            
            if (trimmedLine === 'event: token') {
              isTokenEvent = true;
              continue;
            }
            
            if (trimmedLine === 'event: done') {
              isTokenEvent = false;
              continue;
            }
            
            if (trimmedLine.startsWith('data: ')) {
              const data = trimmedLine.slice(6);
              
              if (data.startsWith('resp_')) {
                if (!isDoneCallbackCalled) {
                  callbacks.onDone(data);
                  isDoneCallbackCalled = true;
                }
                reader.cancel();
                return;
              } else if (data.trim() !== '' && isTokenEvent) {
                callbacks.onToken(data);
              }
            }
          }
        }
      } catch (streamError) {
        if (!cancelTokenSource.token.reason && !isDoneCallbackCalled) {
          callbacks.onError('Stream okuma hatası');
        }
      }
    };

    await readStream();

  } catch (err) {
    if (cancelTokenSource.token.reason) {
      console.log('Request cancelled');
      return;
    }
    
    const errorMsg = err instanceof Error ? err.message : "Bir hata oluştu";
    callbacks.onError(errorMsg);
  }
};
