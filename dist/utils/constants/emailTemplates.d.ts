interface EmailTemplate {
    text: (url: string) => string;
    html: (url: string) => string;
}
declare const EMAIL_SUBJECTS: {
    readonly EMAIL_VERIFICATION: "Email Verification";
    readonly PASSWORD_RESET: "Password Reset";
};
declare const EMAIL_TEMPLATES: {
    EMAIL_VERIFICATION: EmailTemplate;
    PASSWORD_RESET: EmailTemplate;
};
declare const EMAIL_CONSTANTS: {
    readonly VERIFY_EMAIL_ENDPOINT: "/verify-email";
    readonly RESET_PASSWORD_ENDPOINT: "/reset-password";
    readonly VERIFY_EMAIL_TOKEN_EXPIRATION: "1h";
    readonly RESET_PASSWORD_TOKEN_EXPIRATION: "5m";
};
export { EMAIL_SUBJECTS, EMAIL_TEMPLATES, EMAIL_CONSTANTS, };
