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
│
├── routes
│ ├── postRoutes.js
│ ├── userRoutes.js
│ └── commentRoutes.js
│
├── controllers
│ ├── postController.js
│ ├── userController.js
│ └── commentController.js
│
├── services
│ ├── postService.js
│ ├── userService.js
│ └── commentService.js
│
├── db
      models
      │ ├── post.js
      │ ├── user.js
      │ ├── comment.js
      │ └── category.js
      │
      ├── migrations
      │ ├── [migration files]
      │
      ├── seeders
      │ ├── [seeder files]
│
├── middleware
│ └── authUtils.js
│
utils
   └── validators
      ├── postValidator.js
      ├── userValidator.js
      └── commentValidator.js
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
   npm install
``
Set Up Environment Variables

Create a .env file in the root directory and add the following environment variables:

env
DATABASE_URL=your_postgres_database_url
JWT_SECRET=your_jwt_secret
BCRYPT_SALT_ROUNDS=10
Run Migrations

```bash
npx sequelize-cli db:migrate
```
run the migration
```bash
npx sequelize-cli db:seed:all
```
Start the Application

```bash
npm start
```


# API Endpoints
## User Routes
POST /api/v1/users/signup: Register a new user
POST /api/v1/users/login: Login a user
## Post Routes
POST /api/v1/posts: Create a new post
GET /api/v1/posts: Get all posts
GET /api/v1/posts/:id: Get a post by ID
PUT /api/v1/posts/:id: Update a post by ID
DELETE /api/v1/posts/:id: Delete a post by ID
GET /api/v1/posts/search: Search posts by title or category tag
## Comment Routes
POST /api/v1/comments: Add a new comment to a post
GET /api/v1/comments/:postId: Get all comments for a specific post
## Validation
The application uses Joi for input validation in the following areas:

  User registration and login
  Post creation and updates
  Comment creation
  Authentication
The application uses JWT (JSON Web Tokens) for user authentication. Secure endpoints require a valid JWT token.

## Password Security
Passwords are hashed using bcrypt before being stored in the database.

# Contributing
Feel free to fork the repository and submit pull requests. If you encounter any issues or have suggestions for improvements, please open an issue on GitHub.

# Contact
For any questions or feedback, you can reach me at linkedin([linkedin.com/in/connect2abdulaziz]).


# Key Points:
- **Overview**: Brief introduction to the project.
- **Technologies Used**: List of technologies and tools used in the project.
- **Project Structure**: Description of the project folder structure.
- **Features**: Key features of the application.
- **Installation**: Steps to set up the project locally.
- **API Endpoints**: Overview of available API routes.
- **Validation and Authentication**: Details on validation and authentication mechanisms.
- **Contributing**: Information for contributors.
- **License and Contact**: Licensing information and contact details.

-- Feel free to adjust any details to better fit your project's specifics or personal preferences.

