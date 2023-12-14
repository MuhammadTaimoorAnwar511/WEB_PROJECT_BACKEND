const jwt = require('jsonwebtoken'); 
const Customer = require('../models/Customer.schema');

const getNotifications = async (req, res) => {
    try {
        // Get the token from the request header
        const token = req.headers.authorization.split(' ')[1];

        // Decode the token to get the user's ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Find the user in the database
        const user = await Customer.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Retrieve the user's notifications
        const notifications = user.Notifications;

        // Send the notifications as a response
        res.status(200).json({ notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
module.exports = { getNotifications };
