const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ClientRoutes = require('./Routes/Customer'); 
dotenv.config(); 
const app = express();
app.use(express.json());
// User routes
app.use('/api/client', ClientRoutes);
const port = 3001;
// Connect to MongoDB using the MONGO_URI from the .env file
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Check if the connection is successful
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});