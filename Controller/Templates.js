const jwt = require('jsonwebtoken');
const SellerProjects = require('../models/SellerProjects.schema');
const Buyer =require('../models/Customer.schema');
const Seller =require('../models/Seller.schema');

const getallsellerprojects = async (req, res) => {
    try {
      // Fetch all seller projects from the database
      const allSellerProjects = await SellerProjects.find();
  
      // Check if there are no projects
      if (!allSellerProjects || allSellerProjects.length === 0) {
        return res.status(404).json({ message: 'No seller projects found' });
      }
  
      // Count the total number of projects
      const totalProjects = allSellerProjects.length;
  
      // If projects are found, return them along with the total number of projects
      res.status(200).json({ totalProjects, projects: allSellerProjects });
    } catch (error) {
      // Handle errors
      console.error('Error getting seller projects:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getallprojectsofspecificsellerbyid = async (req, res) => {
    try {
      const { sellerId } = req.params;
  
      // Fetch projects of a specific seller by sellerId from the database
      const sellerProjects = await SellerProjects.find({ sellerId });
  
      // Check if there are no projects for the specific seller
      if (!sellerProjects || sellerProjects.length === 0) {
        return res.status(404).json({ message: 'No projects found for the specified seller' });
      }
  
      // Count the total number of projects for the specific seller
      const totalSellerProjects = sellerProjects.length;
  
      // If projects are found, return them along with the total number of projects for the specific seller
      res.status(200).json({ totalSellerProjects, projects: sellerProjects });
    } catch (error) {
      // Handle errors
      console.error('Error getting seller projects by sellerId:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getprojectofsellerbyprojectid = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Fetch a specific project by projectId from the database
    const project = await SellerProjects.findById(projectId);

    // Check if the project with the specified projectId exists
    if (!project) {
      return res.status(404).json({ message: 'No project found for the specified projectId' });
    }

    // If the project is found, return it
    res.status(200).json(project);
  } catch (error) {
    // Handle errors
    console.error('Error getting seller project by projectId:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// New function to get projects by title
const getprojectsbytitle = async (req, res) => {
  try {
      const { title } = req.params;

      // Fetch projects by title from the database
      const projects = await SellerProjects.find({ Title: { $regex: title, $options: 'i' } });

      // Check if there are no projects with the specified title
      if (!projects || projects.length === 0) {
          return res.status(404).json({ message: 'No projects found for the specified title' });
      }

      // Count the total number of projects with the specified title
      const totalProjects = projects.length;

      // If projects are found, return them along with the total number of projects with the specified title
      res.status(200).json({ totalProjects, projects });
  } catch (error) {
      // Handle errors
      console.error('Error getting projects by title:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};

const buysellerProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Decoding token from the request header
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const buyerId = decoded.userId;
    const buyerFullName = decoded.FullName; // Assuming the buyer's full name is stored in the token

    // Fetch the specific project by projectId from the database
    const project = await SellerProjects.findById(projectId);

    // Check if the project with the specified projectId exists
    if (!project) {
      return res.status(404).json({ message: 'No project found for the specified projectId' });
    }

    // Check if the buyer has already purchased the project
    if (project.Buyer.includes(buyerId)) {
      return res.status(400).json({ message: 'Buyer has already purchased this project' });
    }

    // Fetch buyer's account balance
    const buyer = await Buyer.findById(buyerId);
    const buyerBalance = buyer.AccountBalance;

    // Check if buyer has enough balance to make the purchase
    if (buyerBalance < project.Price) {
      return res.status(400).json({ message: 'Insufficient balance. Please top up your account.' });
    }

    // Deduct amount from buyer's account balance
    buyer.AccountBalance -= project.Price;
    await buyer.save();

    // Add amount to seller's account balance
    const seller = await Seller.findById(project.sellerId);
    seller.AccountBalance += project.Price;
    await seller.save();

    // Perform the purchase logic (you can update project, buyer details, etc.)
    project.Buyer.push(buyerId);
    project.Sales += 1;
    project.Revenue += project.Price;

    // Save the updated project to the database
    const updatedProject = await project.save();

    // Send notification to the seller
    const sellerNotification = {
      message: `${buyerFullName} has purchased your project "${project.Title}" for ${project.Price} RS.`,
    };
    seller.Notifications.push(sellerNotification);
    await seller.save();

    // Send notification to the buyer
    const buyerNotification = {
      message: `You have successfully purchased the project "${project.Title}" for ${project.Price} RS.`,
    };
    buyer.Notifications.push(buyerNotification);

    // Update buyer's PaymentHistory
    const paymentHistoryEntry = {
      message: `You purchased the project "${project.Title}" for ${project.Price} RS.`,
      createdAt: new Date(),
    };
    buyer.PaymentHistory.push(paymentHistoryEntry);
    await buyer.save();

    // If the project is successfully purchased, return the updated project
    res.status(200).json(updatedProject);
  } catch (error) {
    // Handle errors
    console.error('Error purchasing the project:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getBuyerProjects = async (req, res) => {
  try {
    // Decoding buyer ID from the request header
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const buyerId = decoded.userId;
    //console.log(buyerId);
    // Fetch projects that match the buyer ID
    const buyerProjects = await SellerProjects.find({ 'Buyer': { $in: [buyerId] } });

    // Check if there are no projects
    if (!buyerProjects || buyerProjects.length === 0) {
      return res.status(404).json({ message: 'You have not purchased any product till now' });
    }

    // Count the total number of projects for the buyer
    const totalProjects = buyerProjects.length;

    // If projects are found, return them along with the total number of projects
    res.status(200).json({ totalProjects, projects: buyerProjects });
  } catch (error) {
    // Handle errors
    console.error('Error getting buyer projects:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getallsellerprojects,getallprojectsofspecificsellerbyid, getprojectofsellerbyprojectid, getprojectsbytitle,buysellerProjectById, getBuyerProjects };
