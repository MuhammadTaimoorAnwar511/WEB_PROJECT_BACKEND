const jwt = require('jsonwebtoken'); 
const Chat = require('../models/Chat.Schema');

const sendMessage = async (req, res) => {
    try {
        // Get the receiverId from the request parameters
        const receiverId = req.params.receiverId;

        // Get the message from the request body
        const { message } = req.body;

        // Get the token from the request header
        const token = req.headers.authorization.split(' ')[1];

        // Decode the token to get the user's ID and sender's name
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userId, FullName } = decoded;

        const chatMessage = new Chat({
            senderId: userId,
            senderName: FullName, 
            receiverId,
            message,
        });

        await chatMessage.save();

        // Fetching all messages between the sender and receiver
        const chatHistory = await Chat.find({
            $or: [
                { senderId: userId, receiverId },
                { senderId: receiverId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 }); // Sorting by creation time

        res.status(201).json(chatHistory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { sendMessage };