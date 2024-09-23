import Joi from 'joi';
declare const commentSchema: Joi.ObjectSchema<any>;
declare const updateCommentSchema: Joi.ObjectSchema<any>;
declare const queryCommentSchema: Joi.ObjectSchema<any>;
declare const queryRepliesSchema: Joi.ObjectSchema<any>;
export { queryCommentSchema, queryRepliesSchema, commentSchema, updateCommentSchema, };
