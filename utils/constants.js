module.exports = {
  STATUS_CODE: {
    CREATED: 201,
    OK: 200,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    GONE: 410,
    INTERNAL_SERVER_ERROR: 500,
  },

  ERROR_MESSAGES : {
    USER_NOT_FOUND: 'User not found',
    USER_ALREADY_EXISTS: 'User already exists',
    INCORRECT_PASSWORD: 'Incorrect password',
    INVALID_TOKEN: 'Invalid token',
    MAX_ATTEMPTS_EXCEEDED: 'Too many login attempts. Please try again later.',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    INVALID_EMAIL_FORMAT: 'Invalid email format',
    INVALID_IMAGE_FORMAT: 'Invalid image format',
    CATEGORY_ID_INVALID: 'Category ID must be a positive integer between 1 and 10',
    TITLE_REQUIRED: 'Title is required',
    CONTENT_REQUIRED: 'Content is required',
    READ_TIME_INVALID: 'Read time must be a positive integer',
    IMAGE_BASE64_INVALID: 'Image must be a valid base64 string',
    THUMBNAIL_BASE64_INVALID: 'Thumbnail must be a valid base64 string',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long',
    PASSWORD_PATTERN_INVALID: 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
    CONFIRM_PASSWORD_MISMATCH: 'Passwords do not match',
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Email must be a valid email address',
    CONTENT_STRING_REQUIRED: 'Content must be a string',
    CONTENT_CANNOT_BE_EMPTY: 'Content cannot be empty',
    POST_ID_REQUIRED: 'Post ID is required',
    PARENT_ID_INVALID: 'Parent ID must be a positive number',
    FIRST_NAME_REQUIRED: 'First name is required',
    FIRST_NAME_MIN_LENGTH: 'First name must be at least 1 character long',
    FIRST_NAME_MAX_LENGTH: 'First name must be less than 256 characters long',
    LAST_NAME_REQUIRED: 'Last name is required',
    LAST_NAME_MIN_LENGTH: 'Last name must be at least 1 character long',
    LAST_NAME_MAX_LENGTH: 'Last name must be less than 256 characters long',
    PASSWORD_PATTERN: 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
    CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required'

  },

  PASSWORD_PATTERN : {
    REGEXP : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  }
};

