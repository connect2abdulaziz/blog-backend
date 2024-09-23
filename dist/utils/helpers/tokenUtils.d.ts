declare const generateToken: (userId: number) => string;
declare const verifyToken: (token: string) => number;
export { generateToken, verifyToken };
