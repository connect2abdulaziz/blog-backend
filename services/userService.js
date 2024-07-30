const User = require('../db/models/user');
const AppError = require('../utils/appError');
const { hashPassword } = require("../utils/hashPasswordUtils");
const { generateToken } = require('../utils/authUtils');
const bcrypt = require('bcrypt');

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
const createUser = async ({ firstName, lastName, email, password }) => {
    try {
        // Check if the email is already registered
        const alreadyRegistered = await findByEmail(email);
        if (alreadyRegistered) {
            throw new AppError('Email already registered', 400);
        }
        // Hash the password
        const hashedPassword = await hashPassword(password);

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
        if (error instanceof AppError) {
            throw error; 
        }
        throw new AppError('Error creating user', 500); 
    }
};

// Function to login a user with enhanced error handling
const loginUser = async ({ email, password }) => {
    try {
        // Find the user by email
        const result = await findByEmail(email);
        if (!result || !(await bcrypt.compare(password, result.password))) {
            throw new AppError("Invalid email or password", 400);
        }
        const token = generateToken({ id: result.id });
        return token;
    } catch (error) {
        if (error instanceof AppError) {
            throw error; 
        }
        throw new AppError('Error logging in user', 500); 
    }
};

module.exports = {
    findByEmail, 
    createUser, loginUser
};
