const UserModel = require('../models/Customer.schema'); 
const jwt = require('jsonwebtoken');

// Controller to get a user's profile
const getUserProfile = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(' ')[1]; 

        // Decode token to get the user ID
        const decoded = jwt.verify(token,  process.env.JWT_SECRET ); 

        // Fetch user data from the database
        const user = await UserModel.findById(decoded.userId); 

        // Check if user exists
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Send user data as response
         res.status(200).json(user);
        
    } 
    catch (error) {
        // Handle possible errors
        res.status(500).send({ message: "Error retrieving user data" });
    }
};

// Controller to update a user's profile
// const updateUserProfile = async (req, res) => {
//     try {
//         console.log("Request body:", req.body); 

//         const token = req.headers.authorization.split(' ')[1];
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await UserModel.findById(decoded.userId);

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         const { FullName, Email, Password } = req.body;
//         let isUpdated = false;

//         if (FullName && user.FullName !== FullName) {
//             user.FullName = FullName;
//             isUpdated = true;
//         }
//         if (Email && user.Email !== Email) {
//             user.Email = Email;
//             isUpdated = true;
//         }

        
//         if (isUpdated) {
//             await user.save();
//             console.log("User updated:", user); 
//             res.status(200).json({ message: "Profile updated successfully", user });
//         } else {
//             res.status(200).json({ message: "No changes made to profile", user });
//         }
//     } catch (error) {
//         console.error("Error updating user profile:", error);
//         res.status(500).json({ message: "Error updating user profile", error: error.message });
//     }
// };

const updateUserProfile = async (req, res) => {
    try {
        console.log("Request body:", req.body);

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { FullName, Email, Password } = req.body;
        let isUpdated = false;

        if (FullName && user.FullName !== FullName) {
            user.FullName = FullName;
            isUpdated = true;
        }
        if (Email && user.Email !== Email) {
            user.Email = Email;
            isUpdated = true;
        }

        // Check if the Password field is present and update the password
        if (Password) {
            user.Password = Password;
            isUpdated = true;
        }

        if (isUpdated) {
            await user.save();
            console.log("User updated:", user);
            res.status(200).json({ message: "Profile updated successfully", user });
        } else {
            res.status  (200).json({ message: "No changes made to the profile", user });
        }
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Error updating user profile", error: error.message });
    }
};



module.exports = { getUserProfile,updateUserProfile};
