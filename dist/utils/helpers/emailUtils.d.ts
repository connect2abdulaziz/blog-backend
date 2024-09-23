interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}
declare const sendEmail: ({ to, subject, text, html, }: EmailOptions) => Promise<void>;
export default sendEmail;
