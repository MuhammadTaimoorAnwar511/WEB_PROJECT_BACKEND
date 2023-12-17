const SellerProjects = require('../models/SellerProjects.schema');

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

module.exports = { getallsellerprojects,getallprojectsofspecificsellerbyid, getprojectofsellerbyprojectid, getprojectsbytitle };
