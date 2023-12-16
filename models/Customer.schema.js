const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    FullName: String,
    Email: String,
    Role: String,
    Password: String,
    Blocked: Boolean,
    Reason: String,
    Interests: [String],
    AccountBalance: {
        type: Number,
        default: 0
    },
    FreezeBalance: {
        type: Number,
        default: 0
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
}, { timestamps: true });

const model = mongoose.model("Customer", userSchema);
module.exports = model;
