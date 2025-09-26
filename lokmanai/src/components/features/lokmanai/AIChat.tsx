'use client';

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addMessage,
  clearError,
  clearMessages,
  Message,
  setError,
  setLoading,
  startStreamingMessage,
  updateStreamingMessage,
  finishStreamingMessage
} from "@/store/slices/chatSlice";
import React, { useEffect, useRef, useState } from "react";
import AIForm from "./AIForm";
import AILoading from "./AILoading";
import AIErrorMessage from "@/components/ui/ErrorMessages/AIErrorMessage";
import Messages from "./Messages";
import AIChatWithoutMessage from "./AIChatWithoutMessage";
import Icon from "@/components/ui/Icon";

const AIChat = () => {
  const [question, setQuestion] = useState("");
  const dispatch = useAppDispatch();
  const { messages, loading, error } = useAppSelector((state) => state.chat);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // SSE için EventSource referansı
  const eventSourceRef = useRef<EventSource | null>(null);

  // Otomatik scroll fonksiyonu
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup: Component unmount olduğunda EventSource'u kapat
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Kullanıcı mesajını ekle
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date()
    };

    dispatch(addMessage(userMessage));
    dispatch(setLoading(true));
    dispatch(clearError());
    const currentQuestion = question;
    setQuestion(""); // Input'u hemen temizle

    // AI mesajı için boş mesaj oluştur
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };

    dispatch(startStreamingMessage(aiMessage));

    try {
      // Son AI mesajının response ID'sini bul (follow-up için)
      const lastAiMessage = messages.filter(msg => msg.type === 'ai' && msg.responseId).pop();
      const followUpId = lastAiMessage?.responseId || '';

      // URL'i oluştur - follow-up varsa id parametresi ekle
      let url = `http://192.168.1.143:5001/ask-stream?ask=${encodeURIComponent(currentQuestion)}`;
      if (followUpId) {
        url += `&id=${encodeURIComponent(followUpId)}`;
      }

      // EventSource ile SSE bağlantısı kur
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        const eventData = event.data;

        if (event.type === 'token') {
          // Token geldiğinde mesajı güncelle
          dispatch(updateStreamingMessage({
            id: aiMessageId,
            content: eventData
          }));
        }
      };

      eventSource.addEventListener('token', (event) => {
        const tokenData = event.data;
        dispatch(updateStreamingMessage({
          id: aiMessageId,
          content: tokenData
        }));
      });

      eventSource.addEventListener('done', (event) => {
        const responseId = event.data;
        dispatch(finishStreamingMessage({
          id: aiMessageId,
          responseId: responseId
        }));

        eventSource.close();
        eventSourceRef.current = null;
        dispatch(setLoading(false));
      });

      eventSource.onerror = () => {
        dispatch(setError('Bağlantı hatası oluştu'));

        // Hata durumunda mesajı güncelle
        dispatch(updateStreamingMessage({
          id: aiMessageId,
          content: 'Hata: Bağlantı sorunu yaşandı'
        }));

        dispatch(finishStreamingMessage({
          id: aiMessageId,
          responseId: ''
        }));

        eventSource.close();
        eventSourceRef.current = null;
        dispatch(setLoading(false));
      };

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Bir hata oluştu";
      dispatch(setError(errorMsg));

      dispatch(updateStreamingMessage({
        id: aiMessageId,
        content: `Hata: ${errorMsg}`
      }));

      dispatch(finishStreamingMessage({
        id: aiMessageId,
        responseId: ''
      }));

      dispatch(setLoading(false));
    }
  };



  return (
    <div className="flex flex-col h-screen bg-neutral-100 relative">
      {messages.length === 0 ? (
        <AIChatWithoutMessage
          handleSubmit={handleSubmit}
          question={question}
          setQuestion={setQuestion}
          loading={loading}
          messages={messages}
        />
      ) : (
        <>
          {/* Messages Area - Scrollable */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Clear Messages Button */}
            <div className="bg-white border-l border-r border-neutral-200 px-4 py-2 dark:border-none flex-shrink-0">
              <button
                onClick={() => dispatch(clearMessages())}
                className="text-sm text-red-600 hover:text-red-800 flex gap-2 "
              >
                Sohbeti Sil
                <Icon icon="delete" size={16} color="#FF0000" />
              </button>
            </div>

            {/* Messages Container - Scrollable */}
            <div className="flex-1 bg-white border-l border-r border-neutral-200 overflow-y-auto dark:border-none pb-4">
              <div className="p-4 space-y-4">
                {messages.map((message, index) => (
                  <Messages message={message} key={index} />
                ))}

                {loading && (
                  <AILoading />
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {error && (
              <div className="flex-shrink-0">
                <AIErrorMessage error={error} />
              </div>
            )}
          </div>

          {/* Fixed Form Container at Bottom */}
          <div className="bg-white border border-neutral-200 p-4 dark:border-none flex-shrink-0 sticky bottom-0 z-10">
            <AIForm
              handleSubmit={handleSubmit}
              question={question}
              setQuestion={setQuestion}
              loading={loading}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AIChat;
