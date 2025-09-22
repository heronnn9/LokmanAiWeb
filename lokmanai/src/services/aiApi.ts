import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface AiRequest {
  ask: string;
}

interface AiResponse {
  // Add response interface based on what the API returns
  response?: string;
  data?: unknown;
}

// Create a separate API instance for AI service
export const askApi = createApi({
  reducerPath: 'aiApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.1.143:5001/',
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
