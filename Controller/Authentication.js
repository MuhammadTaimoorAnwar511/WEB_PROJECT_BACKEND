const User = require('../models/Customer.schema'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a user
exports.register = async (req, res) => {
    try {
        const { FullName, Email, Role, Password, Blocked, Reason, Interests, AccountBalance,FreezeBalance } = req.body;

        // Check if the user already exists
        let user = await User.findOne({ Email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(Password, salt); 

        // Create a new user with the hashed password
        user = new User({
            FullName,
            Email,
            Role,
            Password: hashedPassword, 
            Blocked,
            Reason,
            Interests,
            AccountBalance,
            FreezeBalance
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Login a user
exports.login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        // Find the user by email
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Check if the account is blocked
        if (user.Blocked) {
            return res.status(403).json({ error: 'Account is blocked' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) 
        {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign(
            { userId: user._id, email: Email, role: user.Role, FullName: user.FullName }, 
            process.env.JWT_SECRET,
            { expiresIn: '365d' }
        );

        // User is authenticated
        res.status(200).json({ 
            message: 'User logged in successfully',
            role: user.Role,
            token: token
        });
    }
    catch (error) 
    {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
