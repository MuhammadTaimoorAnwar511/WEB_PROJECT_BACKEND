const Freelance = require('../models/Freelance.schema'); 

// Controller function to search all freelancers
const searchAllFreelancers = async (req, res) => {
    try {
        const freelancers = await Freelance.find({});
        const freelancersCount = await Freelance.countDocuments();

        if (freelancers.length === 0) {
            return res.status(404).send({ message: "No freelancers found" });
        }

        res.status(200).json({  total_freelancers : freelancersCount, freelancers });
    } catch (error) {
        res.status(500).send({ message: "Error occurred while searching for freelancers", error: error.message });
    }
};
// Controller function to search freelancers by specialities
const searchFreelancersBySpecialities = async (req, res) => {
    try {
        const specialityToSearch = req.query.speciality; // Assuming the speciality is passed as a query parameter
        if (!specialityToSearch) {
            return res.status(400).send({ message: "Speciality parameter is required" });
        }

        const freelancers = await Freelance.find({ Specialities: specialityToSearch });
        const freelancersCount = await Freelance.countDocuments();

        if (freelancers.length === 0) {
            return res.status(404).send({ message: `No freelancers found with the speciality: ${specialityToSearch}` });
        }

        res.status(200).json({ total_freelancers : freelancersCount, freelancers} );
    } catch (error) {
        res.status(500).send({ message: "Error occurred while searching for freelancers", error: error.message });
    }
};
// Controller function to search freelancers by name or speciality or both 
const searchFreelancers = async (req, res) => {
    try {
        const nameToSearch = req.query.name;
        const specialityToSearch = req.query.speciality;

        if (!nameToSearch && !specialityToSearch) {
            return res.status(400).send({ message: "Name or speciality parameter is required" });
        }

        let query = {};

        if (nameToSearch && specialityToSearch) {
            // If both parameters are provided, perform a combined search
            query = {
                FullName: new RegExp(nameToSearch, 'i'),
                Specialities: specialityToSearch
            };
        } else if (nameToSearch) {
            // If only name is provided, search by name
            query = { FullName: new RegExp(nameToSearch, 'i') };
        } else if (specialityToSearch) {
            // If only speciality is provided, search by speciality
            query = { Specialities: specialityToSearch };
        }

        const freelancers = await Freelance.find(query);
        const freelancersCount = await Freelance.countDocuments(query);

        if (freelancers.length === 0) {
            return res.status(404).send({
                message: nameToSearch
                    ? "No freelancers found "
                    : `No freelancers found with the speciality: ${specialityToSearch}`
            });
        }

        res.status(200).json({
            total_freelancers: freelancersCount,
            freelancers
        });
    } catch (error) {
        res.status(500).send({ message: "Error occurred while searching for freelancers", error: error.message });
    }
};
// Controller function to rate a freelancer
const rateFreelancer = async (req, res) => {
    try {
        const freelancerId = req.params.freelancerId; // Use req.params.freelancerId
       // console.log('Received freelancerId:', freelancerId); // Log the received ID

        const { rating } = req.body;
       // console.log('Received rating:', rating);

        // Validate the rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).send({ message: "Invalid rating. Rating must be between 1 and 5." });
        }

        // Find the freelancer by ID
        const freelancer = await Freelance.findById(freelancerId);
       
        const isValidNumber = (value) => !isNaN(value) && typeof value === 'number';

        // Inside your rateFreelancer function
        if (!isValidNumber(freelancer.TotalRating)) {
            freelancer.TotalRating = 0; // Set a default value or handle it as needed
        }
        
        if (!isValidNumber(freelancer.TotalNumberofFeddbacks)) {
            freelancer.TotalNumberofFeddbacks = 0; // Set a default value or handle it as needed
        }
        
        if (!isValidNumber(freelancer.AvgRating)) {
            freelancer.AvgRating = 0; // Set a default value or handle it as needed
        }
        
        // Check if the freelancer exists
        if (!freelancer) {
            return res.status(404).send({ message: "Freelancer not found" });
        }

        // Update the total rating and total number of feedbacks
        freelancer.TotalRating += rating;
        freelancer.TotalNumberofFeddbacks += 1;

        // Calculate the average rating
        freelancer.AvgRating = freelancer.TotalRating / freelancer.TotalNumberofFeddbacks;
        
        // Save the updated freelancer
        await freelancer.save();

        res.status(200).json({ message: "Freelancer rated successfully", avgRating: freelancer.AvgRating });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};



module.exports = { searchFreelancers, searchAllFreelancers, searchFreelancersBySpecialities, rateFreelancer };