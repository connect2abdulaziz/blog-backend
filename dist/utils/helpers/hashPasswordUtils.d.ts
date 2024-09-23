declare const hashPassword: (password: string) => Promise<string>;
declare const comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
export { hashPassword, comparePassword };
