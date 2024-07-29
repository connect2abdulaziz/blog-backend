// validators/postValidator.js
const Joi = require('joi');

const validatePost = (post) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    body: Joi.string().min(10).required(),
    userId: Joi.number().required()
  });

  return schema.validate(post);
};

module.exports = { validatePost };
