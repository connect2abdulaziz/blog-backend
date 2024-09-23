import { UserAttributes } from "../types/model.Interfaces";
import { UserRequest, UserResponse } from "../types/app.interfaces";
declare const createUserServices: ({ firstName, lastName, email, password, }: UserAttributes) => Promise<UserResponse>;
declare const forgotPasswordServices: (email: string) => Promise<UserResponse>;
declare const verifyEmailServices: (token: string) => Promise<UserResponse>;
declare const loginUserServices: ({ email, password, }: {
    email: string;
    password: string;
}) => Promise<UserResponse>;
declare const resetPasswordServices: ({ password }: {
    password: string;
}, token: string) => Promise<UserResponse>;
declare const getUserByIdServices: (id: number) => Promise<UserResponse>;
declare const updateUserServices: (userId: number, updates: UserRequest) => Promise<UserResponse>;
declare const deleteUserServices: (userId: number, password: string) => Promise<UserResponse>;
declare const changePasswordServices: (userId: number, { currentPassword, newPassword, }: {
    currentPassword: string;
    newPassword: string;
}) => Promise<UserResponse>;
declare const updateUserImageServices: (userId: number, file: {
    path: string;
}) => Promise<UserResponse>;
declare const refreshTokenServices: (token: string) => Promise<UserResponse>;
declare const logoutUserServices: (refreshToken: string) => Promise<UserResponse>;
export { createUserServices, verifyEmailServices, loginUserServices, forgotPasswordServices, resetPasswordServices, getUserByIdServices, updateUserServices, deleteUserServices, changePasswordServices, updateUserImageServices, refreshTokenServices, logoutUserServices, };
