// lib/utils.ts
/**
 * Given any user-typed raw value (may include thousand separators or comma),
 * return a normalized Turkish-formatted money string with:
 *  - thousand separators as dots
 *  - decimal separator as comma
 *  - always 2 decimal digits
 *
 * Rules:
 *  - If the user did NOT type a comma, treat everything as the integer part and use ",00".
 *  - If the user DID type a comma, respect what’s on the right (max 2 digits).
 */
export const formatPrice = (raw: string | undefined): string => {
    if (!raw) return ''; // << Early exit for empty

    // Remove everything except digits and comma
    let cleaned = raw.replace(/[^\d,]/g, '');
    if (cleaned === '') return ''; // << If user deleted all chars

    const firstComma = cleaned.indexOf(',');
    if (firstComma !== -1) {
        cleaned =
            cleaned.slice(0, firstComma + 1) +
            cleaned.slice(firstComma + 1).replace(/,/g, '');
    }

    const hasComma = cleaned.includes(',');
    const [leftRaw, rightRaw = ''] = cleaned.split(',');

    const intDigits = (leftRaw || '').replace(/\D/g, '');
    if (intDigits === '' && !hasComma) return ''; // << Don’t render 0,00

    let decDigits = hasComma ? rightRaw.replace(/\D/g, '').slice(0, 2) : '';
    if (!hasComma) decDigits = '00';
    while (decDigits.length < 2) decDigits += '0';

    const intFormatted =
        intDigits === ''
            ? '0'
            : intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${intFormatted},${decDigits}`;
};

/**
 * Formats a programmatic value (number or string) for display in the input.
 * - Numbers: show with 2 decimals (Turkish), thousand separators.
 * - Strings: if they include a comma, respect it; otherwise treat as integer and use ",00".
 * - When priceInput=false, return the value as-is.
 */
export const getInputValue = ({
    value,
    priceInput,
    showUnspecifiedForZero = false,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    priceInput: boolean;
    showUnspecifiedForZero?: boolean;
}) => {
    if (!priceInput) return value;

    if (value === undefined || value === null || value === '') return '';

    // Numbers: format as Turkish money
    if (typeof value === 'number' && !Number.isNaN(value)) {
        if (showUnspecifiedForZero && value === 0) return 'Belirtilmemiş';
        const fixed = value.toFixed(2).replace('.', ','); // "163,00"
        // Add thousand separators to the integer part
        const [i, d] = fixed.split(',');
        const intFormatted = i.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return `${intFormatted},${d}`;
    }

    // Strings: use formatPrice rules (treat as raw input)
    if (typeof value === 'string') {
        // If explicitly "0" and showUnspecifiedForZero, return label
        const asNum = parseFloat(
            value
                .replace(/\./g, '') // remove thousand separators
                .replace(',', '.') // convert decimal
        );
        if (showUnspecifiedForZero && !Number.isNaN(asNum) && asNum === 0) {
            return 'Belirtilmemiş';
        }
        return formatPrice(value);
    }

    // Fallback
    return formatPrice(String(value ?? ''));
};
