const jwt = require('jsonwebtoken');
const mongoProject = require('../models/SellerProjects.schema');
const Seller =require('../models/Seller.schema');

// const addReviewById = async (req, res) => {
//     try {
//         const projectId = req.params.id;
//       //  console.log(projectId);
//         const { Comment, Rating } = req.body;

//         // Token decoding logic
//         const token = req.headers.authorization.split(' ')[1];
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const { userId, FullName } = decoded;

//         const review = {
//             reviewerId: userId,
//             reviewerName: FullName,
//             Comment,
//             Rating
//         };

//         // Find the project by ID
//         const findProject = await mongoProject.findById({ _id: projectId });

//         if (findProject) {
//             const sellerId = findProject.sellerId;

//             // Check if the reviewer is not the seller
//             if (userId !== sellerId) {
//                 // Update the project with the new review
//                 await mongoProject.findOneAndUpdate(
//                     { _id: projectId },
//                     { $push: { Feedbacks: review } }
//                 );

//                 // Update the project's rating-related fields
//                 const totalRatings = findProject.TotalRating + Rating;
//                 const totalFeedbacks = findProject.TotalNumberofFeddbacks + 1;
//                 const avgRating = totalRatings / totalFeedbacks;

//                 // Update the project document with new rating values
//                 await mongoProject.findOneAndUpdate(
//                     { _id: projectId },
//                     {
//                         TotalRating: totalRatings,
//                         TotalNumberofFeddbacks: totalFeedbacks,
//                         AvgRating: avgRating
//                     }
//                 );

//                 res.status(200).json({ Message: "Review added successfully." });
//             } else {
//                 res.status(400).json({ Message: "You cannot review your own project." });
//             }
//         } else {
//             res.status(404).json({ Message: "Project Not Found." });
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ Message: "Internal Server Error" });
//     }
// };


const addReviewById = async (req, res) => {
    try {
        const projectId = req.params.id;
        const { Comment, Rating } = req.body;

        // Token decoding logic
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userId, FullName } = decoded;

        const review = {
            reviewerId: userId,
            reviewerName: FullName,
            Comment,
            Rating
        };

        // Find the project by ID
        const findProject = await mongoProject.findById({ _id: projectId });

        if (findProject) {
            const sellerId = findProject.sellerId;

            // Check if the reviewer is not the seller
            if (userId !== sellerId) {
                // Update the project with the new review
                await mongoProject.findOneAndUpdate(
                    { _id: projectId },
                    { $push: { Feedbacks: review } }
                );

                // Update the project's rating-related fields
                const totalRatings = findProject.TotalRating + Rating;
                const totalFeedbacks = findProject.TotalNumberofFeddbacks + 1;
                const avgRating = totalRatings / totalFeedbacks;

                // Update the project document with new rating values
                await mongoProject.findOneAndUpdate(
                    { _id: projectId },
                    {
                        TotalRating: totalRatings,
                        TotalNumberofFeddbacks: totalFeedbacks,
                        AvgRating: avgRating
                    }
                );

                
                // Send push notification to the seller
                const seller = await Seller.findById(sellerId);
                if (seller) {
                    console.log("chala");
                    const notificationMessage = `${FullName} has reviewed your project  ${findProject.Title} with a rating of ${Rating}`;
                    seller.Notifications.push({
                        message: notificationMessage,
                        createdAt: new Date()
                    });

                    await seller.save();
                }




                res.status(200).json({ Message: "Review added successfully." });
            } else {
                res.status(400).json({ Message: "You cannot review your own project." });
            }
        } else {
            res.status(404).json({ Message: "Project Not Found." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ Message: "Internal Server Error" });
    }
};


module.exports = { addReviewById };
