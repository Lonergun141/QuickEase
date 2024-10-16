export const handleError = (navigate, errorMessage) => {
    const encodedMessage = encodeURIComponent(errorMessage);
    navigate(`/TranscribeError?error=${encodedMessage}`);
};
