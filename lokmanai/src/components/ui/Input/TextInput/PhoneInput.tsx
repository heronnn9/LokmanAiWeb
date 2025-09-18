'use client';

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { InputProps } from '@/@interfaces/input';
import TextInput from './TextInput';

const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) return '';

    //format should be 0 (555) 555 55 55
    let formatted = cleaned[0] === '0' ? '0 (' : `0 (${cleaned[0]}`;
    if (cleaned.length > 1) formatted += cleaned.slice(1, 4);
    if (cleaned.length > 4) formatted += `) ${cleaned.slice(4, 7)}`;
    if (cleaned.length > 7) formatted += ` ${cleaned.slice(7, 9)}`;
    if (cleaned.length > 9) formatted += ` ${cleaned.slice(9, 11)}`;

    return formatted;
};

const cleanPhoneNumber = (value: string): string => {
    return value.replace(/\D/g, '').slice(0, 11); // Keep only numbers, max 11 digits (including leading 0)
};

const PhoneInput = forwardRef<HTMLInputElement, InputProps>(
    ({ onChange, value: externalValue, ...props }, ref) => {
        const inputRef = useRef<HTMLInputElement>(null);
        const [displayValue, setDisplayValue] = useState('');

        useEffect(() => {
            const raw = cleanPhoneNumber(externalValue?.toString() || '');
            setDisplayValue(formatPhoneNumber(raw));
        }, [externalValue]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const raw = cleanPhoneNumber(e.target.value);
            setDisplayValue(formatPhoneNumber(raw));

            if (onChange) {
                onChange({
                    ...e,
                    target: {
                        ...e.target,
                        value: raw, // Ensure raw number is sent
                    },
                });
            }
        };

        return (
            <div className="relative">
                <TextInput
                    {...props}
                    ref={(node) => {
                        if (typeof ref === 'function') {
                            ref(node);
                        } else if (ref) {
                            ref.current = node;
                        }
                        inputRef.current = node;
                    }}
                    type="tel"
                    value={displayValue}
                    onChange={handleChange}
                    placeholder="(5XX) XXX XX XX"
                />
            </div>
        );
    }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
