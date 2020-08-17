const Photo = require('../models/petitions.photos.model');
const Petition = require('../models/petition.model');
const User = require('../models/user.server.models');

exports.getPetitionsPhoto = async function (req, res) {
    try {
        const queryResult = await Photo.getPetitionsInfo(req.params.petition_id);
        if (queryResult.length === 0){
            res.statusMessage = "Error - Not found";
            res.status(404).send();
        }
        else {
            const photoPath = await Photo.photoPath(queryResult[0].photo_filename);
            res.statusMessage  = "OK";
            res.status(200).sendFile(photoPath);
        }
    }
    catch (err) {
        res.statusMessage = "Internal Server Error";
        res.status(500).send(err);
    }
}

exports.putPetitionsPhoto = async function (req, res) {
    try{
        const contentType  = req.header("Content-Type");
        const userIdFromToken = await User.getUserIdFromToken(req.header("X-Authorization"));
        const petitionInfo = await Photo.getPetitionsInfo(req.params.petition_id);

        if (userIdFromToken === null) {
            res.statusMessage = "Unauthorised - Not authenticated";
            res.status(401).send();
        } else if (petitionInfo.length === 0) {
            res.statusMessage = "User id not found"
            res.status(404).send();
        } else if (userIdFromToken !== petitionInfo[0].author_id) {
            res.statusMessage = "Forbidden";
            res.status(403).send();
        } else if (contentType !== 'image/jpeg' && contentType !== 'image/gif' && contentType !== 'image/png') {
            res.statusMessage = "Bad Request: photo must be image/jpeg, image/png, image/gif type";
            res.status(400).send();
        } else {
            const mimeType = Photo.getMimeType(contentType);
            const userPhotoFilename = ('petition_' + req.params.petition_id + mimeType);
            const petitionHasExistingPhoto = (petitionInfo[0].photo_filename != null);
            await Photo.putPetitionPhoto(req.params.petition_id, userPhotoFilename, req.body);

            if (petitionHasExistingPhoto) {
                res.statusMessage = "OK";
                res.status(200).send();
            } else {
                res.statusMessage = "Created";
                res.status(201).send();
            }
        }
    }
    catch (err) {
        console.log(err);
        res.statusMessage = "Internal Server Error";
        res.status(500).send(err);
    }
}