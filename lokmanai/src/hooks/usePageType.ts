'use client';
import { AUTH_PAGES } from '@/constants/app.constants';
import { NON_LAYOUT_PAGES } from '@/constants/app.constants';
import { usePathname } from 'next/navigation';

export const useIsLayoutPage = () => {
    const pathname = usePathname();
    return !NON_LAYOUT_PAGES.includes(pathname);
};

export const useIsAuthPage = () => {
    const pathname = usePathname();
    return AUTH_PAGES.includes(pathname);
};

export const useIsSharedPage = () => {
    const pathname = usePathname();
    // Shared sayfalar için özel pathname kontrolleri
    // Route group (shared) URL'de görünmez, bu yüzden pathname kontrolü yapmalıyız
    const sharedPaths = ['/shared', '/public']; // Shared sayfa path'lerini buraya ekle
    return sharedPaths.some((path) => pathname.startsWith(path));
};
