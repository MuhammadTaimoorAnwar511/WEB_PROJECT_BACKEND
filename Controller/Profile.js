const UserModel = require('../models/Customer.schema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Controller to get a user's profile
const getUserProfile = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(' ')[1];

        // Decode token to get the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

const updateUserProfile = async (req, res) => {
    try {
        // console.log("Request body:", req.body);

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { FullName, Email, Password, Interests } = req.body;
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
            const salt = await bcrypt.genSalt(10); // Generate a salt
            const hashedPassword = await bcrypt.hash(Password, salt);
            user.Password = hashedPassword;
            isUpdated = true;
        }
        if (Interests && Array.isArray(Interests)) {
            user.Interests.push(...Interests);
            isUpdated = true;
        }

        if (isUpdated) {
            await user.save();

            // Generate a new token with updated information
            const updatedToken = jwt.sign(
                { userId: user._id, email: user.Email, role: user.Role, FullName: user.FullName },
                process.env.JWT_SECRET,
                { expiresIn: '365d' }
            );

            res.status(200).json({
                message: "Profile updated successfully",
                user,
                token: updatedToken  // Send the new token in the response
            });
        } else {
            res.status(200).json({ message: "No changes made to the profile", user });
        }
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Error updating user profile", error: error.message });
    }
};

module.exports = { getUserProfile, updateUserProfile };

// const updateUserProfile = async (req, res) => {
//     try {
//        // console.log("Request body:", req.body);

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

//         // Check if the Password field is present and update the password
//         if (Password) {
//             const salt = await bcrypt.genSalt(10); // Generate a salt
//             const hashedPassword = await bcrypt.hash(Password, salt);
//             user.Password = hashedPassword;
//             isUpdated = true;
//         }

//         if (isUpdated) {
//             await user.save();
//            // console.log("User updated:", user);
//             res.status(200).json({ message: "Profile updated successfully", user });
//         } else {
//             res.status  (200).json({ message: "No changes made to the profile", user });
//         }
//     } catch (error) {
//         console.error("Error updating user profile:", error);
//         res.status(500).json({ message: "Error updating user profile", error: error.message });
//     }
// };