const mongoose = require("mongoose")

const reviews = new mongoose.Schema({
    reviewerId:String,
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
    AvgRating: { type: Number, default: 0 },
    TotalRating: { type: Number, default: 0 },
    TotalNumberofFeddbacks: { type: Number, default: 0 },
    Sales: { type: Number, default: 0 },
    Price: { type: Number, default: 0 },
    Revenue: { type: Number, default: 0 },
    Feedbacks: { type: [reviews], default: [] },
    Buyer: {type : [String], default: [] }
},{timestamps:true})

const model = mongoose.model("SellerProjects" , userSchema);
module.exports = model;