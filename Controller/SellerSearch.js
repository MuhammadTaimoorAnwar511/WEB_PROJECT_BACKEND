const Seller = require('../models/Seller.schema'); 

// Controller function to search all sellers
const searchAllSeller = async (req, res) => {
    try {
        const sellers = await Seller.find({});
        const sellersCount = await Seller.countDocuments();

        if (sellers.length === 0) {
            return res.status(404).send({ message: "No sellers found" });
        }

        res.status(200).json({ total_sellers: sellersCount, sellers });
    } catch (error) {
        res.status(500).send({ message: "Error occurred while searching for sellers", error: error.message });
    }
};

// Controller function to search freelancers by name or speciality or both 
const searchSeller = async (req, res) => {
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

        const sellers = await Seller.find(query);
        const sellersCount = await Seller.countDocuments(query);

        if (sellers.length === 0) {
            return res.status(404).send({
                message: nameToSearch
                    ? "No sellers found "
                    : `No sellers found with the speciality: ${specialityToSearch}`
            });
        }

        res.status(200).json({
            total_sellers: sellersCount,
            sellers
        });
    } catch (error) {
        res.status(500).send({ message: "Error occurred while searching for sellers", error: error.message });
    }
};


module.exports = { searchSeller, searchAllSeller};
