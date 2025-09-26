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
import axios, { CancelTokenSource } from 'axios';
import { streamingChat } from '@/services/aiApi';
import AIForm from "./AIForm";
import AILoading from "./AILoading";
import AIErrorMessage from "@/components/ui/ErrorMessages/AIErrorMessage";
import Messages from "./Messages";
import AIChatWithoutMessage from "./AIChatWithoutMessage";
import Icon from "@/components/ui/Icon";

const AIChat = () => {
  const [question, setQuestion] = useState("");
  const dispatch = useAppDispatch();
  const { messages, loading, error, lastResponseId } = useAppSelector((state) => state.chat);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel('Component unmounted');
        cancelTokenSourceRef.current = null;
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
      const requestBody = {
        user_text: currentQuestion,
        ...(lastResponseId && { previous_respond_id: lastResponseId })
      };

      const cancelTokenSource = axios.CancelToken.source();
      cancelTokenSourceRef.current = cancelTokenSource;

      // Streaming callbacks
      let isFirstToken = true;
      const callbacks = {
        onToken: (data: string) => {
          if (isFirstToken) {
            dispatch(setLoading(false));
            isFirstToken = false;
          }

          dispatch(updateStreamingMessage({
            id: aiMessageId,
            content: data
          }));
        },
        onDone: (responseId: string) => {
          dispatch(finishStreamingMessage({
            id: aiMessageId,
            responseId: responseId
          }));
          dispatch(setLoading(false));
          cancelTokenSourceRef.current = null;
        },
        onError: (error: string) => {
          dispatch(setError(error));
          dispatch(updateStreamingMessage({
            id: aiMessageId,
            content: `Hata: ${error}`
          }));
          dispatch(finishStreamingMessage({
            id: aiMessageId,
            responseId: ''
          }));
          dispatch(setLoading(false));
          cancelTokenSourceRef.current = null;
        }
      };

      // Streaming chat'i başlat
      await streamingChat(requestBody, callbacks, cancelTokenSource);

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
      cancelTokenSourceRef.current = null;
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
