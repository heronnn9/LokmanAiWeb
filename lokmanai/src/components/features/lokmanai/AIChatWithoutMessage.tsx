import React from 'react'
import AIForm from './AIForm'
import { Message } from '@/store/slices/chatSlice'
import MessageCard from '@/components/ui/Card/MessageCard'
import { DEFAULT_MESSAGES } from './constants/default.messages'

const AIChatWithoutMessage = ({ handleSubmit, question, setQuestion, loading }: { handleSubmit: (e: React.FormEvent) => void, question: string, setQuestion: (question: string) => void, loading: boolean, messages?: Message[] }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-white border-l border-r border-neutral-200 dark:border-none">
            <div className="text-center text-gray-500 mb-8">
                <p>Merhaba! Size nasıl yardımcı olabilirim?</p>
            </div>
            <div className="w-full max-w-2xl px-4 flex flex-col gap-4">

                <AIForm
                    handleSubmit={handleSubmit}
                    question={question}
                    setQuestion={setQuestion}
                    loading={loading}
                    messages={[]}
                />
                <div className="flex justify-center mr-16  gap-4">
                    {DEFAULT_MESSAGES.map((message) => (
                        <MessageCard key={message.name} message={message} onClick={() => { setQuestion(message.name) }} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AIChatWithoutMessage