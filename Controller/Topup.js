const jwt = require('jsonwebtoken');
const User = require('../models/Customer.schema');

exports.topUpBalance = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ Email: decodedToken.email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const topUpAmount = req.body.topUpAmount;

        if (isNaN(topUpAmount) || topUpAmount <= 0) {
            return res.status(400).json({ error: 'Invalid top-up amount' });
        }

        user.AccountBalance += topUpAmount;

        // Store timestamp as a Date object
        const timestamp = new Date();

        // Add the top-up entry to the user's TopupHistory
        user.TopupHistory.push({
            amount: topUpAmount,
            timestamp: timestamp
        });

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


// Get top-up balance history of the user
exports.getTopUpHistory = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ Email: decodedToken.email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let topUpHistory = user.TopupHistory;

        // Sort the top-up history array by timestamp in descending order
        topUpHistory.sort((a, b) => b.timestamp - a.timestamp);

        res.status(200).json({ topUpHistory });
    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

