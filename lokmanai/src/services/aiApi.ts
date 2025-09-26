import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios, { CancelTokenSource } from 'axios';

interface AiRequest {
  user_text: string;
  previous_respond_id?: string;
}

interface AiResponse {
  // Add response interface based on what the API returns
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

// Create a separate API instance for AI service
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
    // AI Endpoint
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
    // Axios ile POST SSE request
    const response = await axios.post('http://192.168.1.143:8000/ask/stream', request, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
      responseType: 'stream',
      cancelToken: cancelTokenSource.token,
    });

    // Stream okuma fonksiyonu
    const readStream = () => {
      let buffer = '';
      
      response.data.on('data', (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        
        // Son satır incomplete olabilir, onu buffer'da tut
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.trim() === '') continue;

          if (line.startsWith('event: token')) {
            continue; // Event type'ı atla
          }
          
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // "data: " kısmını kaldır
            
            // Token data'sını callback ile gönder
            callbacks.onToken(data);
          }
          
          if (line.startsWith('event: done')) {
            continue; // Event type'ı atla
          }
          
          // Done event'inin data'sını yakala
          if (line.startsWith('data: resp_')) {
            const responseId = line.slice(6); // "data: " kısmını kaldır
            callbacks.onDone(responseId);
            return; // Stream'i bitir
          }
        }
      });

      response.data.on('end', () => {
        // Stream ended
      });

      response.data.on('error', (streamError: Error) => {
        console.error('Stream reading error:', streamError);
        callbacks.onError('Stream okuma hatası');
      });
    };

    // Stream okumaya başla
    readStream();

  } catch (err) {
    // Axios error handling
    if (axios.isCancel(err)) {
      console.log('Request cancelled:', err.message);
      return;
    }
    
    const errorMsg = axios.isAxiosError(err) 
      ? err.response?.data?.message || err.message 
      : err instanceof Error ? err.message : "Bir hata oluştu";
      
    callbacks.onError(errorMsg);
  }
};
