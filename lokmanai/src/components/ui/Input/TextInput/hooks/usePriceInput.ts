import { useState, useEffect } from 'react';
import { getInputValue, formatPrice } from '../lib/utils';
import { handleInputChange } from '../lib/handlers';
import { InputProps } from '@/@interfaces/input';

const usePriceInput = (
    value: InputProps['value'],
    priceInput: InputProps['priceInput'],
    onChange: InputProps['onChange'],
    inputElRef: React.RefObject<HTMLInputElement | null>
) => {
    const [displayValue, setDisplayValue] = useState('');

    // tiny helper to restore caret after state update
    const setCaret = (pos: number) => {
        requestAnimationFrame(() => {
            const el = inputElRef.current;
            if (!el) return;
            const clamp = Math.max(0, Math.min(pos, el.value.length));
            el.setSelectionRange(clamp, clamp);
        });
    };

    // Initialize display value when the component mounts or when the value prop changes
    useEffect(() => {
        if (priceInput) {
            if (value !== undefined) {
                // Use getInputValue to format the value properly
                const formattedValue = getInputValue({
                    value,
                    priceInput,
                });
                setDisplayValue(formattedValue);
            } else {
                setDisplayValue('');
            }
        }
    }, [priceInput, value]);

    // Handle change event specifically for price input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!priceInput) {
            onChange?.(e);
            return;
        }

        const el = e.target;
        const raw = el.value; // what the user just typed
        const prevDisplay = displayValue || ''; // what we were showing
        const prevSel = el.selectionStart ?? prevDisplay.length;

        if (raw === '') {
            setDisplayValue('');

            // Make the original event carry empty string and NaN
            const t = e.target as unknown as HTMLInputElement;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (t as any).value = ''; // RHF / consumers read this
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (t as any).valueAsNumber = NaN; // number type, not undefined

            onChange?.(e);
            // optionally also restore caret to 0
            // setCaret(0);
            return;
        }

        // Next formatted text for display
        const nextDisplay = formatPrice(raw);
        setDisplayValue(nextDisplay);

        // Propagate numeric value outward (RHF, etc.)
        handleInputChange(e, true, onChange);

        // ---- Caret math ----
        const rawCommaIdx = raw.indexOf(',');
        const nextCommaIdx = nextDisplay.indexOf(',');
        const prevCommaIdx = prevDisplay.indexOf(',');

        const rawHasComma = rawCommaIdx !== -1;
        const wasBeforeComma =
            !rawHasComma ||
            prevSel <= (rawCommaIdx === -1 ? raw.length : rawCommaIdx);

        // integer lengths (with separators)
        const prevIntLen = (prevDisplay.split(',')[0] || '').length;
        const nextIntLen = (nextDisplay.split(',')[0] || '').length;
        const intDelta = nextIntLen - prevIntLen;

        let nextCaret = nextDisplay.length;

        if (!rawHasComma) {
            // Integer-first typing: keep caret just before the comma
            nextCaret = Math.max(0, nextCommaIdx);
        } else if (wasBeforeComma) {
            // Keep caret on the left side; adjust for added/removed thousand dots
            // We also protect the case where previous text had no comma yet
            const base =
                prevCommaIdx === -1 ? Math.min(prevSel, prevIntLen) : prevSel;
            nextCaret = Math.min(nextCommaIdx, base + intDelta);
        } else {
            // User is editing decimals; clamp to 2 digits
            const prevAfter = prevSel - (rawCommaIdx + 1);
            const decimals = nextDisplay.split(',')[1] || '';
            const maxDec = Math.min(2, decimals.length);
            // Preserve “offset after comma” but clamp to available range
            const after = Math.max(0, Math.min(prevAfter, maxDec));
            nextCaret = nextCommaIdx + 1 + after;
        }

        setCaret(nextCaret);
    };

    return {
        displayValue,
        handleChange,
    };
};

export default usePriceInput;
