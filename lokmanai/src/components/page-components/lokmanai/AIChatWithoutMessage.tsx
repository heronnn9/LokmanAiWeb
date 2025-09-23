import React from 'react'
import AIForm from './AIForm'
import { Message } from '@/store/slices/chatSlice'

const AIChatWithoutMessage = ({ handleSubmit, question, setQuestion, loading }: { handleSubmit: (e: React.FormEvent) => void, question: string, setQuestion: (question: string) => void, loading: boolean, messages?: Message[] }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-white border-l border-r border-neutral-200 dark:border-none">
            <div className="text-center text-gray-500 mb-8">
                <p>Merhaba! Size nasıl yardımcı olabilirim?</p>
            </div>
            <div className="w-full max-w-2xl px-4">
                <AIForm
                    handleSubmit={handleSubmit}
                    question={question}
                    setQuestion={setQuestion}
                    loading={loading}
                    messages={[]}
                />
            </div>
        </div>
    )
}

export default AIChatWithoutMessage