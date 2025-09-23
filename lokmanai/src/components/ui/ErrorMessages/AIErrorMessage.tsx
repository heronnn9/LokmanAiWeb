import { useAppDispatch } from '@/store/hooks'
import { clearError } from '@/store/slices/chatSlice'
import React from 'react'

const AIErrorMessage = (error: any) => {
    const dispatch = useAppDispatch()
    return (
        <div className="bg-white border-l border-r border-neutral-200 px-4 py-2 dark:border-none">
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
    )
}

export default AIErrorMessage