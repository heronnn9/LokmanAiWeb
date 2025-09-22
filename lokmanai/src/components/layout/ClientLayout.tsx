'use client';

import { useAuth } from '@/hooks/useAuth';
import {
    useIsAuthPage,
    useIsLayoutPage,
    useIsSharedPage,
} from '@/hooks/usePageType';

import ProtectedLayout from './ProtectedLayout';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isAuthPage = useIsAuthPage();
    const isLayoutPage = useIsLayoutPage();
    const isSharedPage = useIsSharedPage();

    // Korumalı routelar için kimlik doğrulaması kontrolü
    useAuth({
        isAuthPage,
        isSharedPage,
        isAuthSuccessPage: false,
    });

    return (
        <>
            <ProtectedLayout
                isSafeZone={isLayoutPage}
                showSidebar={!isAuthPage && !isSharedPage} // Auth ve shared sayfalarda sidebar gösterme
                showNavbar={false} // Şu an navbar kullanmıyoruz
            >
                {children}
            </ProtectedLayout>
        </>
    );
}
