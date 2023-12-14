const jwt = require('jsonwebtoken');
const User = require('../models/Customer.schema');

// Top-up balance based on the provided token and amount
exports.topUpBalance = async (req, res) => {
    try {
        // Get the token from the Authorization header
        const token = req.headers.authorization.split(' ')[1];

        // Decode the token to extract user information
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user based on the decoded email
        const user = await User.findOne({ Email: decodedToken.email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get the top-up amount from the request body
        const topUpAmount = req.body.topUpAmount;

        // Check if the top-up amount is valid
        if (isNaN(topUpAmount) || topUpAmount <= 0) {
            return res.status(400).json({ error: 'Invalid top-up amount' });
        }

        // Perform the top-up logic
        user.AccountBalance += topUpAmount;

        // Save the updated user object
        await user.save();

        res.status(200).json({ message: 'Balance topped up successfully', newBalance: user.AccountBalance });
    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};
