// // paymentController.js
// //const Stripe = require('stripe')(process.env.Stripe_SECRET_KEY);
// const stripe = require('stripe')(process.env.Stripe_SECRET_KEY);


// async function processPayment(req, res) {
//   try {
//     const { token, amount } = req.body;
//     console.log('Stripe API Key:', process.env.Stripe_SECRET_KEY);
    
//     // Validate input
//     if (!token || !amount || isNaN(amount)) {
//       return res.status(400).json({ error: 'Invalid input data', status: 'Failure' });
//     }

//     // Process payment
//     const charge = await stripe.charges.create({
//       source: token.id,
//       amount,
//       currency: 'usd',
//     });
//      // Handle successful payment
//     res.status(200).json({ status: 'success', chargeId: charge.id });
//    // res.json({ status: 'success', chargeId: charge.id });
//   } catch (error) {
//     console.error(error);

//     // Handle specific Stripe errors
//     if (error.type === 'StripeCardError') {
//       return res.status(400).json({ error: 'Card error', status: 'Failure' });
//     }

//     // Handle other errors
//     res.status(500).json({ error: 'Server error', status: 'Failure' });
//   }
// }

// module.exports = { processPayment };