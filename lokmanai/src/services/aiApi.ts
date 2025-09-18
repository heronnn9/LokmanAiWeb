interface AiRequest {
  ask: string;
}

interface AiResponse {
  // Add response interface based on what the API returns
  response?: string;
  data?: any;
}

export const askAi = async (question: string): Promise<AiResponse> => {
  try {
    const response = await fetch('http://192.168.1.143:5001/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ask: question }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('AI API Error:', error);
    throw error;
  }
};