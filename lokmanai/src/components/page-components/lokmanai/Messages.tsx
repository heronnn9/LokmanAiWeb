import React from 'react'
import { Message } from '@/store/slices/chatSlice'

const Messages = ({ message }: { message: Message }) => {
    return (
        <div
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