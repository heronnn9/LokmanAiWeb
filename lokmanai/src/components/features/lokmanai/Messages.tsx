import React from 'react'
import { Message } from '@/store/slices/chatSlice'

const Messages = ({ message }: { message: Message }) => {
    // Eğer mesaj boşsa (streaming başlangıcında), hiçbir şey render etme
    if (!message.content) {
        return null;
    }

    return (
        <div
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
            <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${message.type === 'user'
                    ? 'bg-secondary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-600 text-gray-800 border dark:!text-gray-800 border-gray-200'
                    }`}
            >
                <div className="whitespace-pre-wrap break-words">
                    {message.content}
                    {message.isStreaming && (
                        <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse">|</span>
                    )}
                </div>
                <div className={`text-xs mt-1 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                    {new Date(message.timestamp).toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
        </div>
    )
}

export default Messages