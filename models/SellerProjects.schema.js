const mongoose = require("mongoose")

const reviews = new mongoose.Schema({
    reviewerId:String,//User That has given review
    reviewerName:String,
    Comment:String,
    Rating: { type: Number, default: 0 }
});
const userSchema = mongoose.Schema({
    sellerId:String,
    sellerName:String,
    Title: String,
    ImageUrl:[String],
    ImagePaths:[String],
    Description:String,
    Technologies:[String],
    ProjectfileURL:String,
    ProjectfilePath:String,
    TotalRating: { type: Number, default: 0 },
    TotalNumberofFeddbacks: { type: Number, default: 0 },
    Sales: { type: Number, default: 0 },
    Price: { type: Number, default: 0 },
    Revenue: { type: Number, default: 0 },
    Feedbacks: { type: [reviews], default: [] },
},{timestamps:true})
const model = mongoose.model("SellerProjects" , userSchema);
module.exports = model;