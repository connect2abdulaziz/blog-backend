# Blog Website

## Overview

This project is a Blog Website application that allows users to create, update, and manage blog posts. It includes features such as user authentication, category management, and comments on posts. The application is built using Node.js and Express.js, with Sequelize for ORM and PostgreSQL as the database.

## Technologies Used

- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Backend**: Node.js, Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt
- **Validation**: Joi

## Project Structure

The project is organized in the following structure:

```
app.js
|
|
├── config
|   ├── config.js
|   └── database.js
│
├── routes
│   ├── index.js
│   ├── postRoutes.js
│   ├── userRoutes.js
│   └── commentRoutes.js
│
├── controllers
│   ├── postController.js
│   ├── userController.js
│   └── commentController.js
│
├── services
│   ├── postService.js
│   ├── userService.js
│   └── commentService.js
│
├── db
│   ├── models
│   │   ├── post.js
│   │   ├── user.js
│   │   ├── comment.js
│   │   └── category.js
│   │
│   ├── migrations
│   │   └── [migration files]
│   │
│   ├── seeders
│   │   └── [seeder files]
│
├── middleware
│   └── auth.js
│
└── utils
│    └── validators
│        ├── postValidator.js
│        ├── userValidator.js
│        └── commentValidator.js
│    └── constants
│        └── constants.js  
│    └── errors     
│        ├── appSuccess.js
│        ├── catchAsync.js
│        └── appError.js
│    └── helpers
│        ├── emailUtils.js
│        ├── errorHandler.js
└────────└── hashPasswordUtils.js


```

## Features

- **User Authentication**: Register, login, and authenticate users using JWT.
- **Post Management**: Create, read, update, and delete blog posts.
- **Category Management**: Assign and manage categories for posts.
- **Comment Management**: Add and manage comments on posts.
- **Search Functionality**: Search posts by title or category tag.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/blog-website.git
   cd blog-website
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and add the following environment variables:

   ```env
   DATABASE_URL=your_postgres_database_url
   JWT_SECRET=your_jwt_secret
   BCRYPT_SALT_ROUNDS=10
   ```

4. **Run Migrations**

   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Seed the Database**

   ```bash
   npx sequelize-cli db:seed:all
   ```

6. **Start the Application**

   ```bash
   npm start
   ```




Here’s the updated API documentation with the routes you provided, properly structured for each resource (User, Post, Comment) and with the newly added routes included:

### API Endpoints

#### User Routes

- `POST /api/v1/users/signup`: Register a new user
- `POST /api/v1/users/login`: Login a user
- `POST /api/v1/users/forgot-password`: Request a password reset
- `POST /api/v1/users/reset-password/:token`: Reset password using the token
- `POST /api/v1/users/verify-email/:token`: Verify email address using the token
- `GET /api/v1/users`: Get all users (Protected)
- `GET /api/v1/users/:id`: Get user by ID (Protected)
- `PATCH /api/v1/users/update`: Update the currently authenticated user's details (Protected)
- `DELETE /api/v1/users/delete`: Delete the currently authenticated user (Protected)
- `PATCH /api/v1/users/change-password`: Change the password of the currently authenticated user (Protected)
- `POST /api/v1/users/logout`: Logout the currently authenticated user (Protected)

#### Post Routes

- `POST /api/v1/posts`: Create a new post (Protected)
- `GET /api/v1/posts`: Get all posts, including search results 
- `GET /api/v1/posts/:id`: Get a post by ID
- `PUT /api/v1/posts/:id`: Update a post by ID (Protected)
- `DELETE /api/v1/posts/:id`: Delete a post by ID (Protected)
- `GET /api/v1/posts/:id/my-posts`: Get posts created by the currently authenticated user (Protected)

#### Comment Routes

- `POST /api/v1/comments`: Add a new comment to a post (Protected)
- `GET /api/v1/comments/:postId`: Get all comments for a specific post
- `GET /api/v1/comments/:id/replies`: Get all replies for a specific comment (Protected)
- `PATCH /api/v1/comments/:id`: Update a comment by ID (Protected)
- `DELETE /api/v1/comments/:id`: Delete a comment by ID (Protected)

## Validation

The application uses Joi for input validation in the following areas:

- User registration, login, change password, reset password, update user
- Post creation and updates
- Comment creation and updates

## Authentication

The application uses JWT (JSON Web Tokens) for user authentication. Secure endpoints require a valid JWT token.

## Password Security

Passwords are hashed using bcrypt before being stored in the database.

## Contributing

Feel free to fork the repository and submit pull requests. If you encounter any issues or have suggestions for improvements, please open an issue on GitHub.

## Contact

For any questions or feedback, you can reach me at [LinkedIn](https://www.linkedin.com/in/connect2abdulaziz) and [Portfolio](https://connect2abdulaziz.github.io/abdulaziz/).


