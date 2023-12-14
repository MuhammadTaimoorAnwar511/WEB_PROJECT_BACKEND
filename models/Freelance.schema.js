const mongoose = require("mongoose")

const sampleprojects = new mongoose.Schema({
    Title: String,
    ImageUrl:[String],
    ImagePaths:[String],
    Description:String,
    Technologies:[String],
  });
const userSchema = mongoose.Schema({
    FullName :String,
    Email:String,
    TotalRating:Number,
    TotalNumberofFeddbacks:Number,
    Password:String,
    Blocked:Boolean,
    Reason:String,
    Specialities:[String],
    AccountBalance:Number,
    FreeRivisions:Number,
    Notifications:[String],
    RivisionCost:Number,//After free done
    Samples:[sampleprojects]
},{timestamps:true})
const model = mongoose.model("Freelance" , userSchema);
module.exports = model;

// const mongoose = require("mongoose")

// const sapmleprojects = new mongoose.Schema({
//     Title: String,
//     ImageUrl:[String],
//     ImagePaths:[String],
//     Description:String,
//     Technologies:[String],
//   });
// const userSchema = mongoose.Schema({
//     FullName :String,
//     Email:String,
//     TotalRating:Number,
//     TotalNumberofFeddbacks:Number,
//     Password:String,
//     Blocked:Boolean,
//     Reason:String,
//     Specialities:[String],
//     AccountBalance:Number,
//     FreeRivisions:Number,
//     RivisionCost:Number,
//     Samples:[sapmleprojects]
// },{timestamps:true})
// const model = mongoose.model("Freelance" , userSchema);
// module.exports = model;

