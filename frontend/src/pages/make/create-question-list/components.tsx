export const ErrorMessage = ({ errorMessage }: { errorMessage: string }) =>
    errorMessage && <span id="error-message">{errorMessage}</span>
