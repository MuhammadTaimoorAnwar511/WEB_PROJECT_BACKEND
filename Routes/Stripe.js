const express = require('express');
const Stripe = require('stripe');
const router = express.Router();
const Customer = require('../models/Customer.schema');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

router.post('/payment', async (req, res) => {
  let status;

  // Initialize Stripe within the route handler
  const stripe = Stripe(process.env.Stripe_SECRET_KEY);

  const { token, amount } = req.body;

  try {
    // Get the token from the request header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid authorization header');
    }

    // Extract the token from the header
    const Token = authHeader.split(' ')[1];

    // Decode the token to get the user's ID and sender's name
    const decoded = jwt.verify(Token, process.env.JWT_SECRET);
    const { userId} = decoded;

    // Create a charge
    const charge = await stripe.charges.create({
      source: token.id,
      amount,
      currency: 'usd',
      // currency:'pkr',
    });

    // Check if the charge was successful
    if (charge.status === 'succeeded') {

  // Calculate fees and net amount
  const feePercentage = 0.029; // Example fee percentage from Stripe
  const feePerTransaction = 0.30; // Example fee per transaction from Stripe
  const grossAmount = amount / 100;; // Convert amount to dollars
  const fees = grossAmount * feePercentage + feePerTransaction;
  const netAmount = grossAmount - fees;



      // Update the user's AccountBalance
      const updatedCustomer = await Customer.findOneAndUpdate(
        { _id: userId },
        {
          $inc: { AccountBalance: netAmount}, 
          //AccountBalance += netAmount;
          $push: {
            Notifications: {
              message: `You have TOPUP ${(netAmount).toFixed(2)} RS.`,
              createdAt: new Date(),
            },
            TopupHistory: {
              amount: netAmount,
              timestamp: new Date(),
            },
          },

        },
        { new: true }
      );

      // Log success
     // console.log('Payment succeeded:', charge);

      // Send the updated customer data in the response
      res.json({ customer: updatedCustomer, status: 'success' });
    } else {
      throw new Error('Payment failed.');
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    status = 'Failure';
    res.json({ error, status });
  }
});
module.exports = router;