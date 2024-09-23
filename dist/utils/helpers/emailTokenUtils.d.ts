interface SendEmailWithTokenParams {
    userId: number;
    email: string;
    subject: string;
    textTemplate: (url: string) => string;
    htmlTemplate: (url: string) => string;
    endpoint: string;
    tokenExpiresIn: string;
}
declare const sendEmailWithToken: ({ userId, email, subject, textTemplate, htmlTemplate, endpoint, }: SendEmailWithTokenParams) => Promise<void>;
export { sendEmailWithToken };
