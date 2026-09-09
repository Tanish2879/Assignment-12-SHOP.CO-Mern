const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(String(password), saltRounds);
        return hashedPassword;
    } catch (error) {
        console.log(`Error in hashing password: ${error}`);
        throw error;
    }
};

const comparePassword = async (password, hashedPassword) => {
    try {
        if (!hashedPassword) return false;
        
        // If the stored password is a valid bcrypt hash
        if (typeof hashedPassword === "string" && /^\$2[aby]\$/.test(hashedPassword)) {
            return await bcrypt.compare(String(password), hashedPassword);
        }
        
        // Fallback for legacy plain-text passwords
        return String(password) === String(hashedPassword);
    } catch (error) {
        console.log(`Error in comparing password: ${error}`);
        return false;
    }
};

module.exports = { hashPassword, comparePassword };