'use client';

import { useAskMutation } from "@/services/aiApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addMessage, setLoading, setError, clearError, clearMessages, Message } from "@/store/slices/chatSlice";
import React, { useState, useRef, useEffect } from "react";
import AIForm from "./AIForm";
import AILoading from "./AILoading";
import Image from "next/image";

const AIChat = () => {
  const [question, setQuestion] = useState("");
  const dispatch = useAppDispatch();
  const { messages, loading, error } = useAppSelector((state) => state.chat);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [ask] = useAskMutation();

  // Otomatik scroll fonksiyonu
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    try {
      const result = await ask({ ask: currentQuestion });

      // AI cevabını ekle
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: typeof result === 'string'
          ? result
          : String((result as any)?.response || (result as any)?.data || JSON.stringify(result, null, 2)).replace(/\\u[\dA-F]{4}/gi, (match) =>
            String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
          ),
        timestamp: new Date()
      };

      dispatch(addMessage(aiMessage));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Bir hata oluştu";
      dispatch(setError(errorMsg));

      // Hata durumunda AI mesajı ekle
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Hata: ${errorMsg}`,
        timestamp: new Date()
      };

      dispatch(addMessage(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };



  return (
    <div className="flex flex-col h-screen bg-neutral-100 ">
      <div className="flex-1 flex items-center justify-center p-4 ">
        <div className="w-full max-w-4xl h-full flex flex-col ">
          {/* Header */}
          <div className="bg-white border border-neutral-200 rounded-t-lg p-4 border-b dark:border-secondary-500">
            <div className="flex items-center justify-between">
              <h1 className="text-primary-700 text-heading-1 flex items-center gap-1">
                <Image src="/icons/lokman.svg" alt="LokmanAI" width={24} height={24} />
                Lokman
                <b className="text-secondary-500 text-heading-1">
                  AI
                </b>
              </h1>
              {messages.length > 0 && (
                <button
                  onClick={() => dispatch(clearMessages())}
                  className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Sohbeti Temizle
                </button>
              )}
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 bg-white border-l border-r border-neutral-200 overflow-y-auto dark:border-secondary-500">
            <div className="p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>Merhaba! Size nasıl yardımcı olabilirim?</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}
                    >
                      <div className="whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                      <div className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                        {message.timestamp.toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Loading indicator */}
              {loading && (
                <AILoading />
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-white border-l border-r border-neutral-200 px-4 py-2 dark:border-secondary-500">
              <div className="p-3 bg-red-100 border border-red-300 rounded-md">
                <p className="text-red-700 text-sm">Hata: {error}</p>
                <button
                  onClick={() => dispatch(clearError())}
                  className="text-red-600 hover:text-red-800 text-xs mt-1 underline"
                >
                  Kapat
                </button>
              </div>
            </div>
          )}

          {/* Form Container */}
          <div className="bg-white border border-neutral-200 rounded-b-lg p-4 dark:border-secondary-500">
            <AIForm
              handleSubmit={handleSubmit}
              question={question}
              setQuestion={setQuestion}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
