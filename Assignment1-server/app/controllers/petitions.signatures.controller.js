const petitionSignaturesModel = require('../models/petitions.signatures.model');
const User = require('../models/user.server.models');

exports.getAllPetitionSignatures = async function (req, res) {
    try {
        const queryResult = await petitionSignaturesModel.getAll(req.params.id)
        if (queryResult === null) {
            res.statusMessage = "Petition id not found"
            res.status(404).send();
        }
        res.statusMessage = "OK";
        res.status(200).send(queryResult);
    }
    catch (err) {
        res.statusMessage = "Internal Server Error";
        res.status(500).send(err);
    }
}

exports.signPetition = async function(req, res) {
    try{
        const userIdFromToken = await User.getUserIdFromToken(req.header("X-Authorization"));
        const getSignatures = await petitionSignaturesModel.getAll(req.params.id);
        const hasBeenSigned = (getSignatures.filter(data => data.signatoryId == userIdFromToken).length > 0);
        const currentDate = new Date();

        if (userIdFromToken == null) {
            res.statusMessage = "Unauthorised - Not authenticated";
            res.status(401).send();
            return;
        }
        else if (getSignatures.length === 0) {
            res.statusMessage = "Petition id not found"
            res.status(404).send();
            return;
        }
        else if (hasBeenSigned) {
            res.statusMessage = "Bad Request";
            res.status(403).send();
            return;
        }
        await petitionSignaturesModel.signPetition(userIdFromToken, req.params.id, currentDate);
        res.statusMessage = "OK";
        res.status(201).send();
    }
    catch (err) {
        res.statusMessage = "Internal Server Error";
        res.status(500).send(err);
    }
}

exports.deletePetition = async function (req, res) {
    try {
        const userIdFromToken = await User.getUserIdFromToken(req.header("X-Authorization"));
        const getSignatures = await petitionSignaturesModel.getAll(req.params.id);
        const hasBeenSigned = (getSignatures.filter(data => data.signatoryId == userIdFromToken).length > 0);

        if (userIdFromToken == null) {
            res.statusMessage = "Unauthorised - Not authenticated";
            res.status(401).send();
            return;
        }
        else if (getSignatures.length === 0) {
            res.statusMessage = "Petition id not found"
            res.status(404).send();
            return;
        }
        else if (hasBeenSigned === false) {
            res.statusMessage = "Bad Request - you have not signed this petition";
            res.status(403).send();
            return;
        }
        await petitionSignaturesModel.deleteSignature(userIdFromToken, req.params.id);
        res.statusMessage = "OK";
        res.status(200).send();
    }
    catch (err) {
        res.statusMessage = "Internal Server Error";
        res.status(500).send(err);
    }
}