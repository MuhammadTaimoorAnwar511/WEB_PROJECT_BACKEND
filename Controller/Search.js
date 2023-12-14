const Freelance = require('../models/Freelance.schema'); // Replace with the correct path to your model

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

module.exports = { searchFreelancers, searchAllFreelancers, searchFreelancersBySpecialities };