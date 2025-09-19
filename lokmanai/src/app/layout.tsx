import ClientLayout from '@/components/layout/ClientLayout';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import ReduxProvider from '@/store/Provider';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'LokmanAI',
    description: 'Entegrasyon Paneli',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
        >
            <body className="font-sans antialiased">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <ReduxProvider>
                        <ClientLayout>{children}</ClientLayout>
                    </ReduxProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
