const Photo = require('../models/users.photos.model');
const User = require('../models/user.server.models');

exports.getUsersPhoto = async function (req, res) {
    try {
        const queryResult = await User.getUserUsingId(req.params.user_id);
        if (queryResult[0].photo_filename == null){
            res.statusMessage = "Error - Not found";
            res.status(404).send();
        }
        else {
            const photoPath = await Photo.photoPath(queryResult[0].photo_filename);
            console.log(photoPath);
            res.statusMessage  = "OK";
            res.status(200).sendFile(photoPath);
        }
    }
    catch (err) {
        res.statusMessage = "Internal Server Error";
        res.status(500).send(err);
    }
}

exports.putUsersPhoto = async function (req, res) {
    try {
        const contentType  = req.header("Content-Type");
        const userIdFromToken = await User.getUserIdFromToken(req.header("X-Authorization"));
        const userInfo = await User.getUserUsingId(req.params.user_id);

        if (userIdFromToken === null) {
            res.statusMessage = "Unauthorised - Not authenticated";
            res.status(401).send();
        } else if (userInfo == null) {
            res.statusMessage = "User id not found"
            res.status(404).send();
        } else if (userIdFromToken !== userInfo[0].user_id) {
            res.statusMessage = "Forbidden";
            res.status(403).send();
        } else if (contentType !== 'image/jpeg' && contentType !== 'image/gif' && contentType !== 'image/png') {
            res.statusMessage = "Bad Request: photo must be image/jpeg, image/png, image/gif type";
            res.status(400).send();
        } else {
            const mimeType = Photo.getMimeType(contentType);
            const userPhotoFilename = ('user_' + req.params.user_id + mimeType);
            await Photo.deletePhotoIfExists(userPhotoFilename);
            await Photo.putUsersPhoto(req.params.user_id, userPhotoFilename, req.body);

            const userHasExistingPhoto = (userInfo[0].photo_filename != null);
            if (userHasExistingPhoto) {
                res.statusMessage = "OK";
                res.status(200).send();
            } else {
                res.statusMessage = "Created";
                res.status(201).send();
            }
        }
    }
    catch (err) {
        res.statusMessage = "Internal Server Error";
        res.status(500).send(err);
    }
}

exports.deleteUsersPhoto = async function (req, res) {
    try {
        const userIdFromToken = await User.getUserIdFromToken(req.header("X-Authorization"));
        const userInfo = await User.getUserUsingId(req.params.user_id);

        if (userIdFromToken === null) {
            res.statusMessage = "Unauthorised - Not authenticated";
            res.status(401).send();
        } else if (userInfo[0] === undefined) {
            res.statusMessage = "User id not found"
            res.status(404).send();
        } else if (userIdFromToken !== userInfo[0].user_id) {
            res.statusMessage = "Forbidden";
            res.status(403).send();
        } else {
            await Photo.deleteUsersPhoto(req.params.user_id);
            res.statusMessage = "OK";
            res.status(200).send();
        }
    }
    catch (err) {
        res.statusMessage = "Internal Server Error";
        res.status(500).send(err);
    }
}