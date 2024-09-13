import bcrypt from 'bcrypt';
const saltRounds = 10;

// Function to hash a password
const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Could not hash password');
  }
};

// Function to compare a password with its hashed version
const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw new Error('Could not compare passwords');
  }
};

export { hashPassword, comparePassword };
