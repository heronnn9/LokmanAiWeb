'use client';

import { useAskMutation } from "@/services/aiApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addMessage, clearError, clearMessages, Message, setError, setLoading } from "@/store/slices/chatSlice";
import React, { useEffect, useRef, useState } from "react";
import AIForm from "./AIForm";
import AILoading from "./AILoading";
import AIErrorMessage from "@/components/ui/ErrorMessages/AIErrorMessage";
import Messages from "./Messages";
import AIChatWithoutMessage from "./AIChatWithoutMessage";

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
      <div className="flex-1 flex   ">
        <div className="w-full  h-full flex flex-col ">
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
              {/* Clear Messages Button */}
              <div className="bg-white border-l border-r border-neutral-200 px-4 py-2 dark:border-none">
                <button
                  onClick={() => dispatch(clearMessages())}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  Mesajları Temizle
                </button>
              </div>

              {/* Messages Container */}
              <div className="flex-1 bg-white border-l border-r border-neutral-200 overflow-y-auto dark:border-none">
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
                <AIErrorMessage error={error} />
              )}

              {/* Form Container */}
              <div className="bg-white border border-neutral-200 p-4 dark:border-none">
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
      </div>
    </div>
  );
};

export default AIChat;
