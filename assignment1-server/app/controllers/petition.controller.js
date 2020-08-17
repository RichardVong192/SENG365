// Import the following instructions

const petitions = require('../models/petition.model');
const User = require('../models/user.server.models');

// NOTE: req.params contains the route parameters (in the path portion of the URL)
//       req.query contains the URL query parameters (after the ? in the URL)

exports.getAllPetitions = async function (req, res) {
    try {
        let startIndex = (parseFloat(req.query.startIndex)) || 0;
        let count = (parseFloat(req.query.count)) || 9999999; // If no count specified, show all
        let q = req.query.q || ''; // If no query term specified, show all
        let categoryId = (parseFloat(req.query.categoryId)) || null; // Set null to be checked in model
        let authorId = (parseFloat(req.query.authorId)) || null; // Set null to be checked in model
        let sortBy = req.query.sortBy || "SIGNATURES_DESC"; // If no sortBy field, set to signatures desc default

        if (Number.isInteger(startIndex) === false && startIndex != 0 || (startIndex < 0)) {
            res.statusMessage = "Bad Request";
            res.status(400).send();
            return;
        } else if (Number.isInteger(count) === false && count != 0 || (count < 0)) {
            res.statusMessage = "Bad Request";
            res.status(400).send();
            return;
        } else if (Number.isInteger(categoryId) === false && categoryId != null || categoryId < 0 ) {
            res.statusMessage = "Bad Request";
            res.status(400).send();
            return;
        } else if (Number.isInteger(authorId) === false && authorId != null || authorId < 0) {
            res.statusMessage = "Bad Request";
            res.status(400).send();
            return;
        }

        const queryResult = await petitions.getAllPetitions(startIndex, count, q, categoryId, authorId, sortBy);
        res.statusMessage = "OK";
        res.status(200).send(queryResult);
        return;
    }
    catch (err) {
        res.statusMessage = "Internal Server Error";
        res.status(500).send(err);
        return;
    }
}


exports.addPetitions = async function(req, res) {
    try{
        const createdDate = new Date();
        const userIdFromToken = await User.getUserIdFromToken(req.header("X-Authorization"))
        const categoryIds = await petitions.getAllCategoryIds();

        if (userIdFromToken == null) {
            res.statusMessage = "Unauthorised - Not authenticated";
            res.status(401).send();
            return;
        } else if (createdDate >= req.body.closingDate || categoryIds[req.body.categoryId - 1] == null || req.body.title == null || req.body.description == null ) {
            res.statusMessage = "Bad Request"
            res.status(400).send();
            return;
        } else {
            const queryResult = await petitions.addPetitions( req.body.title, req.body.description, userIdFromToken, req.body.categoryId, createdDate, req.body.closingDate);
            res.statusMessage = "OK";
            res.status(201).send(queryResult);
            return;
        }
    }
    catch (err) {
        res.statusMessage = "Internal Server Error";
        res.status(500).send(err);
        return;
    }
}



exports.getPetitions = async function (req, res) {
    try {
        const queryResult = await petitions.getPetitions(req.params.petition_id);
        if (queryResult === null) {
            res.statusMessage = "Petition id not found"
            res.status(404).send();
            return;
        }
        res.statusMessage = "OK";
        res.status(200).send(queryResult[0]);
        return;
    }
    catch (err) {
        res.statusMessage = "Internal Server Error";
        res.status(500).send();
        return;
    }
}

exports.patchPetitionsId = async function (req, res) {
    try {
        const currentDate = new Date();
        const userIdFromToken = await User.getUserIdFromToken(req.header("X-Authorization"));
        const getPetition = await petitions.getPetitions(req.params.petition_id);
        const categoryIds = await petitions.getAllCategoryIds();
        const getPetitionClosingDate = new Date(getPetition[0].closingDate)

        // User Auth token does not match so not authenticated
        if (userIdFromToken == null) {
            res.statusMessage = "Unauthorised - Not authenticated";
            res.status(401).send();
            return;
            // Petition does not exist
        } else if (getPetition == null) {
            res.statusMessage = "Petition id not found"
            res.status(404).send();
            return;
            // Trying to patch another user's petition while logged in
            // Petition is closed
        } else if (userIdFromToken != getPetition[0].authorId || (getPetitionClosingDate <= currentDate) && getPetition[0].closingDate != null) {
            res.statusMessage = "Forbidden"
            res.status(403).send();
            return;
            // CategoryId is not valid
            // Patch the petition closing date in the past
        } else if ((categoryIds[req.body.categoryId - 1] == null  && categoryIds != null) ||
            (getPetitionClosingDate <= currentDate && getPetition[0].closingDate != null)) {
            res.statusMessage = "Bad request"
            res.status(400).send();
            return;
        } else {
            if (await petitions.patchPetitions(req.body, req.params.petition_id)) {
                res.statusMessage = "OK";
                res.status(200).send();
                return;
                // No changes sent
            } else {
                res.statusMessage = "Bad request";
                res.status(400).send();
                return;
            }
        }
    }
    catch (err) {
        res.statusMessage = "Internal Server Error";
        res.status(500).send(err);
        return;
    }
}

exports.deletePetition = async function (req, res) {
    try{
        const userIdFromToken = await User.getUserIdFromToken(req.header("X-Authorization"));
        const getPetition = await petitions.getPetitions(req.params.petition_id);

        // User Auth token does not match so not authenticated
        if (userIdFromToken == null) {
            res.statusMessage = "Unauthorised - Not authenticated";
            res.status(401).send();
            return;
            // No petitions found using the petition Id
        } else if (getPetition == null) {
            res.statusMessage = "Petition id not found"
            res.status(404).send();
            return;
            // User tries to access another user's petitions
        } else if (userIdFromToken != getPetition[0].authorId) {
            res.statusMessage = "Forbidden"
            res.status(403).send();
            return;
        } else {
            const queryResult = await petitions.deletePetition(req.params.petition_id)
            res.statusMessage = "OK";
            res.status(200).send();
            return;
        }
    }
    catch (err) {
        res.statusMessage = "Internal Server Error";
        res.status(500).send(err);
        return;
    }
}

exports.getCategories = async function (req, res) {
    try {
        const categoriesList = await petitions.getCategories();
        res.statusMessage = "OK";
        res.status(200).send(categoriesList);
    }
    catch (err) {
        res.statusMessage = "Internal Server Error";
        res.status(500).send(err);
    }
}