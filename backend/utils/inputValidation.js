export const validateEmail = (email) => {
    // Regular expression to validate email format (e.g., user@example.com)
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email); // Returns true if the email matches the pattern, false otherwise.
};

export const validatePassword = (password) => {
    // Check if the password is at least 8 characters long
    return password.length >= 8;
    // Example: Ensures that the password meets a basic length requirement.
};

export const sanitizeInput = (input) => {
    // Removes HTML tags from the input to prevent XSS attacks
    return input.replace(/<[^>]*>?/gm, '');
    // Example: Useful for sanitizing user inputs to avoid HTML injection vulnerabilities.
};
