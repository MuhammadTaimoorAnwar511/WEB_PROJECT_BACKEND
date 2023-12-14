const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer.schema');
const Freelancer = require('../models/Freelance.schema');
const Projects = require('../models/Projects.schema');

//CREATE PROJECT  
const CreateProject = async (req, res) => {
    try {
        // Extracting data from the request body
        const { Deadline, Title, Requirements, Description, Budget } = req.body;

        // Extracting Assigned from request query parameters
        const Assigned = req.query.Assigned;

        // Decoding token from the request header
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetching user details using the decoded userId
        const user = await Customer.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Assigning UserId and Username from the decoded token
        const UserId = user._id;
        const Username = user.FullName;

        // Check if customer's account balance is sufficient
        if (user.AccountBalance < Budget) {
            return res.status(400).json({ error: 'Insufficient balance. Please top up.' });
        }

        // Find the assigned freelancer's username
        const assignedFreelancer = await Freelancer.findById(Assigned);

        console.log("Assigned ID:", Assigned);

        if (!assignedFreelancer) {
            return res.status(404).json({ error: 'Assigned freelancer not found' });
        }
        const AssignedUsername = assignedFreelancer.FullName;

        // Update customer's balance
        user.AccountBalance -= Budget;
        user.FreezeBalance += Budget;
        await user.save();

        // Create a new project
        const newProject = new Projects({
            Deadline,
            Title,
            Requirements,
            Description,
            Budget,
            UserId,
            Username,
            Assigned,
            AssignedUsername,
            Status: 'WAITING FOR APPROVAL' // Default status
        });

        // Save the new project
        await newProject.save();

        // Send notification to the assigned freelancer
        const notificationMessage = `${Username} HAS ASSIGNED YOU PROJECT ${Title} `;
        assignedFreelancer.Notifications.push(notificationMessage);
        await assignedFreelancer.save();

        // Return the created project details in the JSON response
        res.status(201).json({
            message: 'Project created successfully',
            project: {
                _id: newProject._id,
                Deadline: newProject.Deadline,
                Title: newProject.Title,
                Requirements: newProject.Requirements,
                Description: newProject.Description,
                Budget: newProject.Budget,
                UserId: newProject.UserId,
                Username: newProject.Username,
                Assigned: newProject.Assigned,
                AssignedUsername: newProject.AssignedUsername,
                Status: newProject.Status,
                Paid: newProject.Paid,
                Tip: newProject.Tip,
                PaidOnDate: newProject.PaidOnDate,
                Keywords: newProject.Keywords,
                createdAt: newProject.createdAt,
                updatedAt: newProject.updatedAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// FETCH ALL PROJECTS OF A USER
const FetchUserAllProjects = async (req, res) => {
    try {
        // Decoding token from the request header
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetching projects for the decoded userId
        const userProjects = await Projects.find({ UserId: decoded.userId })
        .sort({ createdAt: -1 }); 

        // Check if projects exist
        if (!userProjects || userProjects.length === 0) {
            return res.status(404).json({ message: 'No projects found for this user.' });
        }

        // Return the user's projects in the JSON response
        res.status(200).json({
            message: 'Projects fetched successfully',
            projects: userProjects
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// FETCH PROJECTS BY STATUS
const FilterProjectsByStatus = async (req, res) => {
    try {
        // Decoding token from the request header
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetching projects for the decoded userId and the specified status
        const { status } = req.query;
        const userProjects = await Projects.find({ UserId: decoded.userId, Status: status })
            .sort({ createdAt: -1 });

        // Check if projects exist
        if (!userProjects || userProjects.length === 0) {
            return res.status(404).json({ message: `No projects found for this user with status ${status}.` });
        }

        // Return the user's projects with the specified status in the JSON response
        res.status(200).json({
            message: `Projects with status ${status} fetched successfully`,
            projects: userProjects
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

// FETCH PROJECT BY ID
const FetchProjectById = async (req, res) => {
    try {
        // Extracting project ID from request parameters
        const projectId = req.params.projectId;

        // Decoding token from the request header
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetching the project by ID for the decoded userId
        const project = await Projects.findOne({ _id: projectId, UserId: decoded.userId });

        // Check if the project exists
        if (!project) {
            return res.status(404).json({ message: 'Project not found for this user.' });
        }

        // Return the project details in the JSON response
        res.status(200).json({
            message: 'Project fetched successfully',
            project: project
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
// EDIT PROJECT BY ID



const EditProjectById = async (req, res) => {
    try {
        // Extracting project ID from request parameters
        const projectId = req.params.projectId;

        // Decoding token from the request header
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetching the project by ID for the decoded userId
        const project = await Projects.findOne({ _id: projectId, UserId: decoded.userId });
        
        // Check if the project exists
        if (!project) {
            return res.status(404).json({ message: 'Project not found for this user.' });
        }

        // Check if the project status allows for editing
        if (project.Status !== "WAITING FOR APPROVAL") {
            return res.status(403).json({ error: 'Project cannot be edited as it is not in the WAITING FOR APPROVAL status.' });
        }

        // Extracting updated data from the request body
        const { Deadline, Title, Requirements, Description, Budget } = req.body;

        // Fetch user details
        const user = await Customer.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Logic for handling budget update and user balance
        const originalBudget = project.Budget;
        let tempBalance = 0;

        if (Budget) {
            if (Budget > originalBudget) {
                tempBalance = Budget - originalBudget;
                if (tempBalance > user.AccountBalance) {
                    return res.status(400).json({ error: 'Insufficient balance. Please top up.' });
                } else {
                    user.AccountBalance -= tempBalance;
                    user.FreezeBalance += tempBalance;
                }
            } else if (Budget < originalBudget) {
                tempBalance = originalBudget - Budget;
                user.AccountBalance += tempBalance;
                user.FreezeBalance -= tempBalance;
            }
            project.Budget = Budget;
        }

        // Updating other project fields
        if (Deadline) project.Deadline = Deadline;
        if (Title) project.Title = Title;
        if (Requirements) project.Requirements = Requirements;
        if (Description) project.Description = Description;

        // Save the updated user and project
        await user.save();
        await project.save();

        // Return the updated project details in the JSON response
        res.status(200).json({
            message: 'Project updated successfully',
            project: project
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
// DELETE PROJECT BY ID
const DeleteProjectById = async (req, res) => {
    try {
        // Extracting project ID from request parameters
        const projectId = req.params.projectId;

        // Decoding token from the request header
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetching the project by ID for the decoded userId
        const project = await Projects.findOne({ _id: projectId, UserId: decoded.userId });

        // Check if the project exists
        if (!project) {
            return res.status(404).json({ message: 'Project not found for this user.' });
        }

        // Check if the project status is 'REJECTED'
        if (project.Status !== 'REJECTED') {
            return res.status(403).json({ error: 'Only projects with status REJECTED can be deleted.' });
        }

        // Delete the project
        await Projects.deleteOne({ _id: projectId });

        // Return success response
        res.status(200).json({
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { CreateProject, FetchUserAllProjects, FilterProjectsByStatus, FetchProjectById, EditProjectById, DeleteProjectById };
