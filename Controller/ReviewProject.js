const mongoProject = require('../models/SellerProjects.schema');

const addReviewById = async(req, res)=>{
    try{
        let projectId = req.params.id;

        let  { Comment, Rating } = req.body;

        let reviewerId = res.locals.userId;
        let reviewerName = res.locals.name;

        const review = {
            reviewerId,
            reviewerName,
            Comment,
            Rating
        };

        let findProject = await mongoProject.findById(projectId);

        if(findProject){
            let sellerId = findProject.sellerId;
            if (reviewerId !== sellerId){
                await mongoProject.findOneAndUpdate(
                    { sellerId },
                    { $push: { Feedbacks : review }}
                    );
                res.status(200).json({Message: "Review added successfully."});
            }
            else{
                res.status(400).json({Message : "You cannot review your own project."});
            }
        }
        else{
            res.status(404).json({Message : "Project Not Found."});
        }
    }
    catch(err){
        console.log(err);
    }
}
module.exports = {addReviewById };
