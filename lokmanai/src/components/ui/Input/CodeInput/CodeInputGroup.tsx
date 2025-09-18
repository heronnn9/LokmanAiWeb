import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import CodeInput from './CodeInput';

interface CodeInputGroupProps {
    inputCount: number;
    onChange: (value: string) => void;
    error?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
}

const CodeInputGroup = ({
    inputCount,
    onChange,
    error = false,
    disabled = false,
    autoFocus = true,
}: CodeInputGroupProps) => {
    const [values, setValues] = useState<string[]>(Array(inputCount).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    const handleChange = (index: number, value: string) => {
        const newValues = [...values];
        newValues[index] = value;
        setValues(newValues);
        onChange(newValues.join(''));

        // Move to next input if value is entered
        if (value && index < inputCount - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        index: number,
        e: KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === 'Backspace' && !values[index] && index > 0) {
            // Move to previous input on backspace if current input is empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex w-full gap-2">
            {Array.from({ length: inputCount }).map((_, index) => (
                <CodeInput
                    key={index}
                    ref={(el: HTMLInputElement | null) => {
                        inputRefs.current[index] = el;
                    }}
                    value={values[index]}
                    onChange={(value) => handleChange(index, value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={disabled}
                    error={error}
                    autoFocus={autoFocus && index === 0}
                />
            ))}
        </div>
    );
};

export default CodeInputGroup;
