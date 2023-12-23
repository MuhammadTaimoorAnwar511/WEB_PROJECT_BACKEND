const express = require('express');
const router = express.Router();
const ClientController = require('../Controller/Authentication'); 
const ClientProfile  = require('../Controller/Profile'); 
const ClientSearchController = require('../Controller/Search'); 
const SellerSearchController = require('../Controller/SellerSearch'); 
const Topup = require('../Controller/Topup'); 
const ProjectController = require('../Controller/Project'); 
const Notifications =require('../Controller/Notification')
const Chat=require('../Controller/Chat')
const ReviewProject=require('../Controller/ReviewProject')
const SellerProjectController = require('../Controller/Templates');
////////////

/////////
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
//router.post('/topup-balance', Topup.topUpBalance);
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
//get all paymenthistory
router.get('/getallPaymentHistory', Notifications.getPaymentHistory);
//send messageto freelance
router.post('/sendmessage/:receiverId', Chat.sendMessage);
//send message TO SELLER
router.post('/sendmessage-seller/:receiverId', Chat.sendMessage);
// Rate Freelancer route
router.post('/rate-freelancer/:freelancerId', ClientSearchController.rateFreelancer);
// Search SELLER by Name route
router.get('/search-seller', SellerSearchController.searchSeller);
// Search ALL SELLER
router.get('/search-allseller', SellerSearchController.searchAllSeller);
//rate project
router.put("/addReview/:id", ReviewProject.addReviewById);
//get all projects of all sellers
router.get('/sellerallprojects', SellerProjectController.getallsellerprojects);
// Get all projects of a specific seller by sellerId
router.get('/sellerprojects/:sellerId', SellerProjectController.getallprojectsofspecificsellerbyid);
// Get a specific project of seller by projectId
router.get('/sellerproject/:projectId', SellerProjectController.getprojectofsellerbyprojectid);
// Get projects by title
router.get('/sellerprojects/title/:title', SellerProjectController.getprojectsbytitle);
// Buy a specific project by projectId (buyer ID decoded from token)
router.post('/buyproject/:projectId', SellerProjectController.buysellerProjectById);
// Get purchased projects from seller  
router.get('/buyerprojects', SellerProjectController.getBuyerProjects);
// Get all sample projects of a specific freelancer by ID
router.get('/freelancer/samples/:freelancerId', ProjectController.getAllSamplesProjectsOfFreelancerByID);
//////////////////////////////////////////////////////////////


module.exports = router;