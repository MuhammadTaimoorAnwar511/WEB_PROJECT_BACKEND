// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const ClientRoutes = require('./Routes/Customer');
const paymentRoutes = require('./Routes/Stripe');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const port = 3001;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

app.use('/api/client', ClientRoutes);
app.use(paymentRoutes); // Use the imported route

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
