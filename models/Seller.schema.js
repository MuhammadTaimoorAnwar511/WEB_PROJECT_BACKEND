const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    FullName : { type: String, required: true },
    Email: { type: String, required: true },
    Experience: { type: String, default: 'Not specified' },
    Contact: { type: String, default: '' },
    Role: { type: String, default: 'seller' },
    AvgRating:  { type: Number, default:0 },
    TotalRating: { type: Number, default: 0 },
    TotalNumberofFeddbacks: { type: Number, default: 0 },
    Password: { type: String, required: true },
    Blocked: { type: Boolean, default: false },
    Reason: { type: String, default: '' },
    Specialities: { type: [String], default: [] },
    AccountBalance: { type: Number, default: 0 }
},{timestamps:true})
const model = mongoose.model("Seller" , userSchema);
module.exports = model;