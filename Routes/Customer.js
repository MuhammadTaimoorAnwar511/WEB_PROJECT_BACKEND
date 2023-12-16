const express = require('express');
const router = express.Router();
const ClientController = require('../Controller/Authentication'); 
const ClientProfile  = require('../Controller/Profile'); 
const ClientSearchController = require('../Controller/Search'); 
const Topup = require('../Controller/Topup'); // Import the BalanceController
const ProjectController = require('../Controller/Project'); // Import the ProjectController
const Notifications =require('../Controller/Notification')
const Chat=require('../Controller/Chat')
// Register route
router.post('/register', ClientController.register);
// Login route
router.post('/login', ClientController.login);
// User Profile route
router.get('/profile', ClientProfile.getUserProfile); 
// User Profile Update route
router.patch('/profile/update', ClientProfile.updateUserProfile);
// Search Freelancers by Name route
router.get('/search-freelancers', ClientSearchController.searchFreelancers);
// Search all Freelancers
router.get('/search-allfreelancers', ClientSearchController.searchAllFreelancers);
// Search Freelancers by speciality
router.get('/search-freelancers', ClientSearchController.searchFreelancersBySpecialities);
// Top-up balance route
router.post('/topup-balance', Topup.topUpBalance);
//Top-up History
router.get('/topup-balance-history', Topup.getTopUpHistory);
// Create Project route
router.post('/create-project', ProjectController.CreateProject);
// get allProjects of SPECIFIC USER  route
router.get('/allprojects', ProjectController.FetchUserAllProjects);
// get allProjects of SPECIFIC USER  based on status route
router.get('/projects/filter', ProjectController.FilterProjectsByStatus);
// COMPLETED HISTORY
router.get('/projects/deliveredhistory', ProjectController.FetchDeliveredProjects);
// SEARCH  PROJECT BY ID  
router.get('/projectid/:projectId', ProjectController.FetchProjectById);
//EDIT PROJECT BASED ON ID 
router.patch('/edit-project/:projectId', ProjectController.EditProjectById);
//DELETE PROJECT BASED ON ID 
router.delete('/delete-project/:projectId', ProjectController.DeleteProjectById);
//get all notification
router.get('/allnotifications', Notifications.getNotifications);
//send message
router.post('/sendmessage/:receiverId', Chat.sendMessage);
// Rate Freelancer route
router.post('/rate-freelancer/:freelancerId', ClientSearchController.rateFreelancer);

module.exports = router;
