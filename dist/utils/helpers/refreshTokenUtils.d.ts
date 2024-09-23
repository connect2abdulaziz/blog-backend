declare const generateRefreshToken: (userId: number) => string;
declare const verifyRefreshToken: (token: string) => string;
declare const removeRefreshToken: (token: string) => void;
export { generateRefreshToken, verifyRefreshToken, removeRefreshToken };
