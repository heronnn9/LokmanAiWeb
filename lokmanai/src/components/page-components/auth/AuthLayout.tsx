'use client';
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}

            {/* Main Content */}
            <div className="flex min-h-screen">
                {/* Left Side - Decorative */}
                <div className="bg-primary-50 hidden items-center justify-center p-12 lg:flex lg:w-1/2">
                    <div className="max-w-md text-center">
                        <div className="">
                            <h1 className="text-primary-700 text-login-heading">
                                Sync
                                <b className="text-secondary-500 text-login-heading">
                                    Pro
                                </b>
                            </h1>
                        </div>
                        <h2 className="text-primary-700 text-landing-heading mb-2">
                            Entegrasyon Paneli
                        </h2>
                        <p className="text-primary-300 text-input leading-relaxed">
                            SyncPro ile tüm entegrasyonlarınızı tek platformda
                            yönetin. Verimlilik artışı için tasarlanmış modern
                            çözümler.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
                    <div className="w-full max-w-md">{children}</div>
                </div>
            </div>

            {/* Footer */}
            <footer className="text-primary-700 absolute right-0 bottom-0 left-0 p-6 text-center text-sm">
                © 2025 SyncPro. Tüm hakları saklıdır.
            </footer>
        </div>
    );
};

export default AuthLayout;
