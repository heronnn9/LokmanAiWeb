import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type AuthProps = {
    isAuthPage: boolean;
    isSharedPage: boolean;
    isAuthSuccessPage: boolean;
};

export const useAuth = ({
    isAuthPage,
    isSharedPage,
    isAuthSuccessPage,
}: AuthProps) => {
    const { isAuthenticated } = useAppSelector(
        (state: RootState) => state.user
    );
    const router = useRouter();

    useEffect(() => {
        // Client tarafında olduğumuzu kontrol et
        if (typeof window !== 'undefined') {
            const token = document.cookie.includes('auth_token=');
            const isAuthed = token || isAuthenticated;

            // Auth sayfalarında oturum açmış kullanıcıyı anasayfaya yönlendir
            if (isAuthPage && isAuthed) {
                router.replace('/');
            }
            // Korumalı sayfalarda (shared page hariç) oturum açmamış kullanıcıyı giriş sayfasına yönlendir
            else if (
                !isAuthPage &&
                !isSharedPage &&
                !isAuthSuccessPage &&
                !isAuthed
            ) {
                router.replace('/giris-yap');
            }
        }
    }, [isAuthenticated, router, isAuthPage, isSharedPage, isAuthSuccessPage]);

    return { isAuthenticated };
};
