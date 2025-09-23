import Image from 'next/image'
import React from 'react'

const SidebarHeader = () => {
    return (
        <div>
            <h1 className="text-primary-700 text-heading-1 flex items-center gap-1">
                <Image src="/icons/lokman.svg" alt="LokmanAI" width={24} height={24} />
                Lokman
                <b className="text-secondary-500 text-heading-1">
                    AI
                </b>
            </h1>
        </div>
    )
}

export default SidebarHeader