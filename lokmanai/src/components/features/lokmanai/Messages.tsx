import React from 'react'
import { Message } from '@/store/slices/chatSlice'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

const Messages = ({ message }: { message: Message }) => {
    if (!message.content && !message.isStreaming) {
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
                <div className="">
                    {message.type === 'ai' ? (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                                // Code block'lar için özel styling
                                pre: ({ children }) => (
                                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto">
                                        {children}
                                    </pre>
                                ),
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                code: ({ inline, children, ...props }: any) => (
                                    inline ? (
                                        <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
                                            {children}
                                        </code>
                                    ) : (
                                        <code {...props}>{children}</code>
                                    )
                                ),
                                // Liste styling
                                ul: ({ children }) => (
                                    <ul className="list-disc list-inside space-y-1">
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="list-decimal list-inside space-y-1">
                                        {children}
                                    </ol>
                                ),
                                // Link styling
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {children}
                                    </a>
                                ),
                                // Blockquote styling
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic">
                                        {children}
                                    </blockquote>
                                ),
                                h1: ({ children }) => (
                                    <h1 className="text-2xl font-bold mb-2 mt-4 first:mt-0">
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="text-xl font-bold mb-2 mt-3 first:mt-0">
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-lg font-bold mb-2 mt-3 first:mt-0">
                                        {children}
                                    </h3>
                                ),
                                h4: ({ children }) => (
                                    <h4 className="text-base font-bold mb-2 mt-3 first:mt-0">
                                        {children}
                                    </h4>
                                ),
                                h5: ({ children }) => (
                                    <h5 className="text-sm font-bold mb-2 mt-3 first:mt-0">
                                        {children}
                                    </h5>
                                ),
                                h6: ({ children }) => (
                                    <h6 className="text-xs font-bold mb-2 mt-3 first:mt-0">
                                        {children}
                                    </h6>
                                ),
                                p: ({ children }) => (
                                    <p className="mb-3 last:mb-0 leading-relaxed">
                                        {children}
                                    </p>
                                ),

                                li: ({ children }) => (
                                    <li className="leading-relaxed">
                                        {children}
                                    </li>
                                ),
                                strong: ({ children }) => (
                                    <strong className="font-semibold">
                                        {children}
                                    </strong>
                                ),

                            }}
                        >
                            {message.content || ''}
                        </ReactMarkdown>
                    ) : (
                        // User mesajları için normal text
                        <div className="whitespace-pre-wrap break-words">
                            {message.content}
                        </div>
                    )}
                    {/*  {message.isStreaming && (
                        <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse">|</span>
                    )} */}
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