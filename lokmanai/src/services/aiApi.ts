
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CancelTokenSource } from 'axios';


interface AiRequest {
  user_text: string;
  previous_respond_id?: string;
}

/**
 * AI API'sinden dönen yanıt için tip tanımı
 * @param response - AI'dan gelen metin yanıtı
 * @param data - Ek veri (bilinmeyen tip)
 */
interface AiResponse {
  response?: string;
  data?: unknown;
}

/**
 * Streaming chat için callback fonksiyonları
 * @param onToken - Her token (kelime parçası) geldiğinde çalışacak callback
 * @param onDone - Stream tamamlandığında çalışacak callback
 * @param onError - Hata oluştuğunda çalışacak callback
 */
interface StreamingCallbacks {
  onToken: (data: string) => void;
  onDone: (responseId: string) => void;
  onError: (error: string) => void;
}

/**
 * Streaming istek için tip tanımı (AiRequest ile aynı)
 * @param user_text - Kullanıcının AI'ya gönderdiği metin
 * @param previous_respond_id - Önceki sohbet için response ID (opsiyonel)
 */
interface StreamingRequest {
  user_text: string;
  previous_respond_id?: string;
}

/**
 * Redux Toolkit Query API slice'ı - AI servisi için HTTP istekleri
 * Bu API slice'ı normal (non-streaming) AI istekleri için kullanılır
 */
export const askApi = createApi({
  reducerPath: 'aiApi', // Redux store'da bu API'nin kayıt edileceği alan
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://192.168.1.143:8000/', // AI backend'inin base URL'i
    prepareHeaders: (headers) => {
      // Her istekte Content-Type header'ını JSON olarak ayarla
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 'ask' endpoint'i - AI'ya soru sormak için kullanılır
    ask: builder.mutation<AiResponse, AiRequest>({
        query: (request) => ({
            url: 'ask', // /ask endpoint'ine POST isteği gönder
            method: 'POST',
            body: request, // Kullanıcının sorusunu body'de gönder
        }),
        // API'den dönen yanıtı olduğu gibi döndür
        transformResponse: (response: AiResponse) => {
            return response;
        },
    }),
  }),
});

// Hook'u export et - React bileşenlerinde kullanmak için
export const { useAskMutation } = askApi;

/**
 * Streaming Chat Fonksiyonu - Gerçek zamanlı AI yanıtları için
 * Bu fonksiyon Server-Sent Events (SSE) kullanarak AI'dan gelen yanıtları
 * token token (kelime kelime) alır ve callback'ler aracılığıyla UI'ya iletir
 * 
 * @param request - AI'ya gönderilecek istek verisi
 * @param callbacks - Stream olayları için callback fonksiyonları
 * @param cancelTokenSource - İsteği iptal etmek için kullanılan token
 */
export const streamingChat = async (
  request: StreamingRequest,
  callbacks: StreamingCallbacks,
  cancelTokenSource: CancelTokenSource
) => {
  try {
    // AI backend'ine streaming endpoint'ine istek gönder
    const response = await fetch('http://192.168.1.143:8000/ask/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream', // SSE için gerekli header
        'Cache-Control': 'no-cache', // Cache'leme yapma
      },
      body: JSON.stringify(request),
    });

    // HTTP hatası kontrolü
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Response body kontrolü
    if (!response.body) {
      throw new Error('Response body is null');
    }

    // Stream okuyucusu ve decoder'ı başlat
    const reader = response.body.getReader();
    const decoder = new TextDecoder(); // Byte'ları string'e çevirmek için
    let buffer = ''; // Gelen veriyi biriktirmek için buffer
    let isDoneCallbackCalled = false; // onDone callback'inin sadece bir kez çalışması için

    /**
     * Stream'i okuma fonksiyonu
     * Gelen veriyi parçalar halinde okur ve işler
     */
    const readStream = async () => {
      try {
        while (true) {
          // İptal edilmiş mi kontrol et
          if (cancelTokenSource.token.reason) {
            reader.cancel(); // Stream'i iptal et
            break;
          }

          // Stream'den bir chunk oku
          const { done, value } = await reader.read();
          
          // Stream bitti mi?
          if (done) {
            if (!isDoneCallbackCalled) {
              callbacks.onDone(''); // Bitiş callback'ini çağır
              isDoneCallbackCalled = true;
            }
            break;
          }

          // Byte verilerini string'e çevir
          const chunk = decoder.decode(value, { stream: true });
          // console.warn('🔥 CHUNK:', chunk); // Debug için
          buffer += chunk; // Buffer'a ekle
          
          // Buffer'ı satırlara böl (SSE formatı satır satır gelir)
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Son satırı buffer'da tut (henüz tamamlanmamış olabilir)
          
          let isTokenEvent = false; // Şu anki event'in token event'i olup olmadığını takip et
          
          // Her satırı işle
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine === '') continue; // Boş satırları atla
            
            // Event tiplerini kontrol et
            if (trimmedLine === 'event: token') {
              isTokenEvent = true; // Token event'i başladı
              continue;
            }
            
            if (trimmedLine === 'event: ready') {
              isTokenEvent = false; // Ready event'i (başlangıç)
              continue;
            }
            
            if (trimmedLine === 'event: done') {
              isTokenEvent = false; // Done event'i (bitiş)
              continue;
            }
            
            // Data satırını işle (SSE formatında "data: " ile başlar)
            if (trimmedLine.startsWith('data: ')) {
              const data = trimmedLine.slice(6); // "data: " kısmını çıkar
              
              try {
                // Önce JSON olarak parse etmeyi dene
                const jsonData = JSON.parse(data);
                
                if (typeof jsonData === 'object' && jsonData.data) {
                  const tokenData = jsonData.data;
                  
                  // Response ID kontrolü (sohbet bittiğinde gelir)
                  if (typeof tokenData === 'string' && tokenData.startsWith('resp_')) {
                    if (!isDoneCallbackCalled) {
                      callbacks.onDone(tokenData); // Bitiş callback'ini response ID ile çağır
                      isDoneCallbackCalled = true;
                    }
                    reader.cancel(); // Stream'i sonlandır
                    return;
                  } else if (isTokenEvent) {
                    // Token event'i ise, token callback'ini çağır
                    // Boş string'leri boşluk karakteri olarak gönder
                    const processedToken = tokenData === '' ? ' ' : tokenData;
                    callbacks.onToken(processedToken);
                  }
                  // Ready event data'sını atla (sadece başlangıç için)
                }
              } catch {
                // JSON parse hatası durumunda plain text olarak işle (fallback)
                if (data.startsWith('resp_')) {
                  if (!isDoneCallbackCalled) {
                    callbacks.onDone(data); // Response ID'yi direkt olarak gönder
                    isDoneCallbackCalled = true;
                  }
                  reader.cancel(); // Stream'i sonlandır
                  return;
                } else if (isTokenEvent) {
                  // Plain text token'ı gönder, boş string'leri boşluk karakteri olarak işle
                  const processedToken = data === '' ? ' ' : data;
                  callbacks.onToken(processedToken); 
                }
              }
            }
          }
        }
      } catch {
        // Stream okuma hatası durumunda (iptal edilmediyse) hata callback'ini çağır
        if (!cancelTokenSource.token.reason && !isDoneCallbackCalled) {
          callbacks.onError('Stream okuma hatası');
        }
      }
    };

    // Stream okuma işlemini başlat
    await readStream();

  } catch (err) {
    // İstek iptal edilmişse sessizce çık
    if (cancelTokenSource.token.reason) {
      console.log('Request cancelled');
      return;
    }
    
    // Hata durumunda hata mesajını callback'e gönder
    const errorMsg = err instanceof Error ? err.message : "Bir hata oluştu";
    callbacks.onError(errorMsg);
  }
};
