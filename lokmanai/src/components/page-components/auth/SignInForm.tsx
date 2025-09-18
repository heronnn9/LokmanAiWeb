'use client';
import { RTKQueryError } from '@/@types/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input/TextInput/TextInput';
import { BORDER_RADIUS_BASE, SHADOW_BASE } from '@/constants/theme.constants';
import { useLoginMutation } from '@/services/authApi';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import * as yup from 'yup';

// Validation schema
const signInSchema = yup.object({
    mail: yup
        .string()
        .email('Geçerli bir e-posta adresi girin')
        .required('E-posta adresi gerekli'),
    password: yup
        .string()
        .min(6, 'Şifre en az 6 karakter olmalı')
        .required('Şifre gerekli'),
});

const SignInForm = () => {
    const router = useRouter();

    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');

    const [validationErrors, setValidationErrors] = useState<{
        mail?: string;
        password?: string;
    }>({});

    const [formError, setFormError] = useState<string | null>(null);

    const [login, { isLoading }] = useLoginMutation();

    const validateField = useCallback(
        async (field: 'mail' | 'password', value: string) => {
            try {
                await signInSchema.validateAt(field, { [field]: value });
                setValidationErrors((prev) => ({
                    ...prev,
                    [field]: undefined,
                }));
            } catch (error) {
                if (error instanceof yup.ValidationError) {
                    setValidationErrors((prev) => ({
                        ...prev,
                        [field]: error.message,
                    }));
                }
            }
        },
        []
    );

    const onSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
        async (e) => {
            e.preventDefault();
            setFormError(null);
            setValidationErrors({});

            try {
                // Validate all fields
                await signInSchema.validate(
                    { mail, password },
                    { abortEarly: false }
                );

                // If validation passes, attempt login
                await login({ mail, password }).unwrap();
                router.replace('/');
            } catch (error) {
                if (error instanceof yup.ValidationError) {
                    // Handle validation errors
                    const errors: { mail?: string; password?: string } = {};
                    error.inner.forEach((err) => {
                        if (err.path) {
                            errors[err.path as 'mail' | 'password'] =
                                err.message;
                        }
                    });
                    setValidationErrors(errors);
                } else {
                    // Handle RTK Query API errors
                    const apiError = error as RTKQueryError;
                    const errorMessage =
                        apiError?.data?.message ||
                        'Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.';
                    setFormError(errorMessage);
                }
            }
        },
        [mail, password, login, router]
    );

    return (
        <div className="w-full">
            {/* Welcome Header */}
            <div className="mb-4 text-center">
                <h1 className="text-primary-700 text-heading-1">Hoşgeldiniz</h1>
            </div>

            <div
                className={classNames(
                    'dark:!bg-primary-50 border border-neutral-200 bg-white px-8 py-12',
                    BORDER_RADIUS_BASE,
                    SHADOW_BASE
                )}
            >
                <form
                    onSubmit={onSubmit}
                    className="space-y-6"
                >
                    <Input
                        id="email"
                        label="E-posta adresi"
                        placeholder="syncpro@gmail.com"
                        type="email"
                        value={mail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setMail(e.target.value)
                        }
                        onBlur={() => validateField('mail', mail)}
                        isError={!!validationErrors.mail}
                        errorMessage={validationErrors.mail}
                    />

                    <Input
                        id="password"
                        label="Şifre"
                        placeholder="********"
                        type="password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setPassword(e.target.value)
                        }
                        onBlur={() => validateField('password', password)}
                        isError={!!validationErrors.password}
                        errorMessage={validationErrors.password}
                    />

                    {formError && (
                        <div className="bg-danger-50 border-danger-100 text-danger-600 text-button-xs rounded-lg border px-2">
                            {formError}
                        </div>
                    )}

                    <Button
                        type="submit"
                        isLoading={isLoading}
                        variant="secondary"
                        size="base"
                        fullWidth
                    >
                        {isLoading ? 'Giriş yapılıyor...' : 'Giriş yap'}
                    </Button>
                </form>

                {/* Divider */}
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
                <p className="text-neutral-600">
                    Hesabınız yok mu?{' '}
                    <a
                        href="/sign-up"
                        className="text-primary-500 hover:text-primary-700 font-medium transition-colors"
                    >
                        Hemen kaydolun
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignInForm;
