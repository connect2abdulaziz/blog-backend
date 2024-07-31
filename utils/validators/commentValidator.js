const Joi = require('joi');

const commentSchema = Joi.object({
    content: Joi.string()
        .required()
        .messages({
            'string.base': 'Content must be a string',
            'string.empty': 'Content cannot be empty',
            'any.required': 'Content is required'
        }),

    parentId: Joi.number()
        .integer()
        .positive()
        .allow(null)
        .messages({
            'number.base': 'Parent ID must be a number',
            'number.integer': 'Parent ID must be an integer',
            'number.positive': 'Parent ID must be a positive number',
            'any.allowNull': 'Parent ID cannot be null if it is provided'
        }),
        

    postId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Post ID must be a number',
            'number.integer': 'Post ID must be an integer',
            'number.positive': 'Post ID must be a positive number',
            'any.required': 'Post ID is required'
        })
});



const updateCommentSchema = Joi.object({
    content: Joi.string()
        .required()
        .messages({
            'string.base': 'Content must be a string',
            'string.empty': 'Content cannot be empty',
            'any.required': 'Content is required'
        }),
});


module.exports = {commentSchema, updateCommentSchema};
