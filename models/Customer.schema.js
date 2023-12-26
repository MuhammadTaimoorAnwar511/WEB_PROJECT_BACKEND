const mongoose = require("mongoose");

const CustomerSchema = mongoose.Schema({
    FullName: {type: String},
    Email: String,
    Role: {type: String, default:"Customer"},
    Password: String,
    Blocked:{ type: Boolean, default:false},
    Reason: String,
    Interests: [String],
    AccountBalance: {
        type: Number,
        default: 0.00
    },
    FreezeBalance: {
        type: Number,
        default: 0.00
    },
    //Notifications:[String],
    Notifications: [{
        message: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    TopupHistory: [
        {
            amount: Number,
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ],
    PaymentHistory: [{
        message: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
}, { timestamps: true });

const model = mongoose.model("Customer", CustomerSchema);
module.exports = model;