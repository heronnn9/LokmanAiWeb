// copyToClipboard.ts

const copyToClipboard = (text: string) => {
    try {
        navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        return false;
    }
};

export default copyToClipboard;
