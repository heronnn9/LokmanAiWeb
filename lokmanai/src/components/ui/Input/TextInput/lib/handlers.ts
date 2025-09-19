// lib/handlers.ts
/**
 * Creates a numeric value from a Turkish-formatted display string.
 * Example: "1.234,56" -> 1234.56 (number)
 */
const toNumeric = (display: string): number => {
    const normalized = display
        .replace(/\./g, '') // remove thousand separators
        .replace(',', '.'); // use dot for decimal
    const n = parseFloat(normalized);
    return Number.isNaN(n) ? 0 : n;
};

import { formatPrice } from './utils';

export const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    priceInput: boolean,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
) => {
    if (!priceInput) {
        onChange?.(e);
        return;
    }

    // User's raw input at this moment
    const raw = e.target.value;

    // Format for display with the new "integer-first" rule
    const display = formatPrice(raw);

    // Build a synthetic event carrying the numeric value for RHF / consumers
    const valueAsNumber = toNumeric(display);
    const syntheticEvent = {
        ...e,
        target: {
            ...e.target,
            value: String(valueAsNumber),
            valueAsNumber,
        },
    } as React.ChangeEvent<HTMLInputElement>;

    // Call onChange with the numeric value
    onChange?.(syntheticEvent);

    // IMPORTANT: we do NOT set e.target.value here; the component controls display via state.
};
