import React from 'react'

const MessageCard = ({ message, onClick }: { message: { name: string }, onClick: () => void }) => {
    return (
        <button onClick={onClick} className='bg-neutral-50 dark:bg-neutral-900 rounded-2xl px-3 py-1 cursor-pointer'>
            <h3 className='text-body'>{message.name}</h3>
        </button>
    )
}

export default MessageCard