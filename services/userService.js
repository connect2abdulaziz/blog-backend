const User = require('../db/models/user');
const AppError = require('../utils/appError');
const { hashPassword } = require("../utils/hashPasswordUtils");
const { generateToken } = require('../utils/authUtils');
const catchAsync = require('../utils/catchAsync');

// Function to find a user by email
const findByEmail = async (email) => {
    try {
        return await User.findOne({ where: { email } });
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw new AppError('Error checking email existence', 500);
    }
};

// Create a new user with enhanced error handling
const createUser = catchAsync(async ({ firstName, lastName, email, password }) => {
    console.log("Creating user");

    // Check if the email is already registered
    const alreadyRegistered = await findByEmail(email);
    if (alreadyRegistered) {
        throw new AppError('Email already registered', 400);
    }

    console.log("Email is available");

    // Hash the password
    const hashedPassword = await hashPassword(password);

    try {
        // Create a new user
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Process and return user data
        const result = newUser.toJSON();
        const { password: pass, profilePicture, thumbnail, ...cleanedResult } = result;
        cleanedResult.token = generateToken({ id: result.id });

        return cleanedResult;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new AppError('Error creating user', 500);
    }
});

module.exports = {
    findByEmail, createUser
};
