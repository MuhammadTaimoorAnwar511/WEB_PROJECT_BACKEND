const mongoose = require("mongoose")

const Purchase = mongoose.Schema({
    ProjectId:String,
    BuyerId:String,
    BuyerName:String,
    SellerId:String,
    Amount: Number,
},{timestamps:true})
const model = mongoose.model("Purchases" , Purchase);
module.exports = model;