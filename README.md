# Blog Website Backend NodeJs

## Overview

This project is a fully functional Blog Website application that enables users to create, manage, and interact with blog posts. The application provides robust features such as user authentication, category management, comment functionality, and comprehensive API documentation through Swagger.

## Technologies Used

- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Backend**: Node.js, Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt
- **Validation**: Joi
- **API Documentation**: Swagger

## Project Structure

The project is organized following best practices to maintain scalability and ease of maintenance:

```bash
app.js
├── config
│   ├── config.js
│   └── database.js
├── routes
│   ├── index.js
│   ├── postRoutes.js
│   ├── userRoutes.js
│   └── commentRoutes.js
├── controllers
│   ├── postController.js
│   ├── userController.js
│   └── commentController.js
├── services
│   ├── postService.js
│   ├── userService.js
│   └── commentService.js
├── db
│   ├── models
│   │   ├── post.js
│   │   ├── user.js
│   │   ├── comment.js
│   │   └── category.js
│   ├── migrations
│   └── seeders
├── middleware
│   └── auth.js
└── utils
    ├── validators
    │   ├── postValidator.js
    │   ├── userValidator.js
    │   └── commentValidator.js
    ├── constants
    │   └── constants.js  
    ├── errors     
    │   ├── appSuccess.js
    │   ├── catchAsync.js
    │   └── appError.js
    ├── helpers
        ├── emailUtils.js
        ├── errorHandler.js
        └── hashPasswordUtils.js
```

## Features

- **User Authentication**: Secure user registration, login, and JWT-based authentication.
- **Post Management**: Full CRUD operations for blog posts.
- **Category Management**: Categorize posts to enhance organization and search.
- **Comment Management**: Engage with posts through comments and replies.
- **Search Functionality**: Search posts by title or category tags.
- **API Documentation**: Swagger for clear and interactive API documentation.

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/blog-website.git
cd blog-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
DATABASE_URL=your_postgres_database_url
JWT_SECRET=your_jwt_secret
BCRYPT_SALT_ROUNDS=10
```

### 4. Run Migrations

```bash
npx sequelize-cli db:migrate
```

### 5. Seed the Database

```bash
npx sequelize-cli db:seed:all
```

### 6. Start the Application

```bash
npm run start:dev
```

### 7. Access Swagger Documentation

Once the application is running, access the Swagger documentation by navigating to:

```
http://localhost:3000/api-docs
```

This will open an interactive API documentation page where you can explore and test the API endpoints directly.

## Swagger Implementation

Swagger is integrated to provide detailed and interactive API documentation. The Swagger setup is configured in the `app.js` file and is available at the `/api-docs` route. This documentation covers all the endpoints, including parameters, request bodies, and response formats.

To set up Swagger in your project:

1. **Install Swagger Dependencies**

   ```bash
   npm install swagger-jsdoc swagger-ui-express
   ```

2. **Configure Swagger in `app.js`**

   Add the following code in your `app.js`:

   ```javascript
   const swaggerJsDoc = require('swagger-jsdoc');
   const swaggerUi = require('swagger-ui-express');

   const swaggerOptions = {
     swaggerDefinition: {
       openapi: '3.0.0',
       info: {
         title: 'Blog Website API',
         version: '1.0.0',
         description: 'API Documentation for the Blog Website',
         contact: {
           name: 'Abdul Aziz',
           url: 'https://connect2abdulaziz.github.io/abdulaziz/',
           email: 'connect2abdulaziz@gmail.com'
         }
       },
       servers: [
         {
           url: 'http://localhost:3000',
           description: 'Development server'
         }
       ]
     },
     apis: ['./routes/*.js'] // Path to the API docs
   };

   const swaggerDocs = swaggerJsDoc(swaggerOptions);
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
   ```

3. **Annotate Your Routes**

   Use JSDoc comments in your route files (e.g., `postRoutes.js`, `userRoutes.js`) to describe your API endpoints. Swagger will automatically generate the documentation based on these annotations.

   Example:

   ```javascript
   /**
    * @swagger
    * /api/v1/posts:
    *   get:
    *     summary: Retrieve a list of posts
    *     tags: [Posts]
    *     responses:
    *       200:
    *         description: A list of posts
    *         content:
    *           application/json:
    *             schema:
    *               type: array
    *               items:
    *                 $ref: '#/components/schemas/Post'
    */
   ```

## Validation

Input validation is handled using Joi in the following scenarios:

- User registration, login, and profile updates
- Post creation and updates
- Comment creation and updates

## Authentication & Security

- **JWT Authentication**: Secure endpoints are protected using JWT tokens.
- **Password Hashing**: User passwords are hashed using bcrypt before storage, ensuring password security.

## Contributing

We welcome contributions from the community. To contribute:

1. Fork the repository.
2. Create a new branch for your feature/bugfix.
3. Commit your changes.
4. Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Contact

For any questions, suggestions, or feedback, you can reach me at:

- **LinkedIn**: [connect2abdulaziz](https://www.linkedin.com/in/connect2abdulaziz)
- **Portfolio**: [connect2abdulaziz.github.io/abdulaziz](https://connect2abdulaziz.github.io/abdulaziz/)

