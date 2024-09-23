import Joi from 'joi';
declare const userSchema: Joi.ObjectSchema<any>;
declare const loginSchema: Joi.ObjectSchema<any>;
declare const forgotPasswordSchema: Joi.ObjectSchema<any>;
declare const resetPasswordSchema: Joi.ObjectSchema<any>;
declare const updateUserSchema: Joi.ObjectSchema<any>;
declare const changePasswordSchema: Joi.ObjectSchema<any>;
export { userSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, updateUserSchema, changePasswordSchema, };
