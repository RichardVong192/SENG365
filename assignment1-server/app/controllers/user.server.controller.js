// Import the User model and the following functions that are called by the route file

const User = require('../models/user.server.models');
const passwords = require('../models/passwords.models');
const cryptoRandomString = require('crypto-random-string');


// regex to validate against current top level email regulations =   ^[^\s@]+@[^\s@]+\.[^\s@]+$
// But the assignment only checks an @ symbol so can use the simple one =   ^(.+)@(.+)$

exports.register = async function (req, res) {

    try{
        const validEmail = await User.checkUniqueEmail(req.body.email);

        // Check for valid email format
        if (/^(.+)@(.+)$/.test(req.body.email) === false) {
            res.statusMessage = "Bad Request - Bad email";
            res.status(400).send();
            return;
        } else if (!(req.body.hasOwnProperty("email"))) {
            res.statusMessage = "Bad Requst - Email Missing";
            res.status(400).send();
        } else if (!(req.body.hasOwnProperty("name"))) {
            res.statusMessage = "Bad Request - Missing name";
            res.status(400).send();
            return;
        } else if (req.body.name.length === 0){
            res.statusMessage = "Bad Request - Name is empty";
            res.status(400).send();
            return;
            //Email not in use
        } else if (validEmail.length !== 0) {
            res.statusMessage = "Bad Request - Email already in use";
            res.status(400).send();
            return;
            //Password not already in use
        } else if (req.body.password.length === 0){
            res.statusMessage = "Bad Request - Password is empty";
            res.status(400).send();
            return;
        } else if (!(req.body.hasOwnProperty("password"))){
            res.statusMessage = "Bad Request - Password missing"
            res.status(400).send();
            return;
        }

        let hashedPassword = passwords.hash(req.body.password);
        const queryResult = await User.register(req.body.name, req.body.email, hashedPassword, req.body.city, req.body.country);
        res.statusMessage  = "Created";
        res.status(201).send(queryResult);
        return;
    } catch (err) {
        res.statusMessage = "Internal Server Error";
        res.status(500).send(err);
        return;
    }

};



exports.login = async function (req, res){

    try {

        // Check for valid email format
        if (/^(.+)@(.+)$/.test(req.body.email) === false) {
            res.statusMessage = "Bad Request - Bad email format";
            res.status(400).send();
            return;
        }
        else if (req.body.password.length === 0) {
            res.statusMessage = "Bad Request - Password should not be shorter that 1 characters";
            res.status(400).send();
            return;
        }

        let token = cryptoRandomString({length: 32, type:'base64'});
        const queryResult = await User.login(req.body.email, req.body.password, token);

        if (typeof queryResult === "undefined"){
            res.statusMessage = "Bad Request - Invalid email/password supplied"
            res.status(400).send();
            return;
        } else{
            let jsonResult =
                {
                    userId : queryResult.user_id,
                    token : queryResult.auth_token
                };
            res.statusMessage = "OK";
            res.status(200).send(jsonResult);
            return;
        }
    } catch (err) {
        res.statusMessage = "Internal Server Error";
        res.status(500).send(err)
        return;
    }

};


exports.logout = async function (req, res) {

    try{
        if (req.header("X-Authorization") === null){
            res.statusMessage = "Bad Request - X-Auth token is null";
            res.status(401).send()
            return;
        }
        const queryResult = await User.logout(req.header("X-Authorization"));

        if (queryResult.changedRows === 0){
            res.statusMessage = "Bad Request - X-Auth token does not match any users";
            res.status(401).send()
            return;
        } else {
            res.statusMessage = "OK";
            res.status(200).send();
        }
    }catch (err) {
        res.statusMessage = "Internal Server Error";
        res.status(500).send(err);
        return;
    }
};


exports.getUser = async function(req, res) {

    try {
        const queryResult = await User.getUser((req.header("X-Authorization")), req.params.user_id);
        if (queryResult === undefined) {
            res.statusMessage = "Student not found"
            res.status(404).send();
            return;
        }
        res.statusMessage = "OK";
        res.status(200).send(queryResult);
        return;
    } catch (err) {
        res.statusMessage = "Internal Server Error";
        res.status(500).send(err);
        return;
    }
};

exports.patchUserId = async function (req, res) {

    try {

        // Check name length
        if (req.body.hasOwnProperty("name")) {
            if (req.body.name.length === 0 ) {
                res.statusMessage = "Bad Request - Name should not be shorter that 1 characters";
                res.status(400).send();
                return;
            }
        }

        // Check for valid email format and length
        if (req.body.hasOwnProperty("email")) {
            const validEmail = await User.checkUniqueEmail(req.body.email);
            if (/^(.+)@(.+)$/.test(req.body.email) === false) {
                res.statusMessage = "Bad Request - Bad email format";
                res.status(400).send();
                return;
            }
            if (validEmail.length !== 0) {
                res.statusMessage = "Bad Request - Email already in use";
                res.status(400).send();
                return;
            }
        }

        //Check password length and currentPassword requirement
        if (req.body.hasOwnProperty("password")){
            if (req.body.password.length === 0) {
                res.statusMessage = "Bad Request - Password should not be shorter that 1 characters";
                res.status(400).send();
                return;
            }
            if (req.body.hasOwnProperty("currentPassword") === false) {
                res.statusMessage = "Bad Request - current password not provided";
                res.status(400).send();
                return;
            }
        }

        //Check city length
        if (req.body.hasOwnProperty("city")) {
            if (req.body.city.length === 0 ) {
                res.statusMessage = "Bad Request - City should not be shorter that 1 characters";
                res.status(400).send();
                return;
            }
        }

        //Check country length
        if (req.body.hasOwnProperty("country")) {
            if (req.body.country.length === 0 ) {
                res.statusMessage = "Bad Request - Country should not be shorter that 1 characters";
                res.status(400).send();
                return;
            }
        }

        const userIdFromToken = await User.getUserIdFromToken(req.header("X-Authorization"))
        if (userIdFromToken == null) {
            res.statusMessage = "Unauthorized - Not Authenticated";
            res.status(401).send();
            return;
        } else if (userIdFromToken != req.params.user_id) {
            res.statusMessage = "Forbidden - not allowed";
            res.status(403).send();
            return;
        } else {
            if (await User.patchUserId(req.body, req.params.user_id, req.header("X-Authorization"))) {
                res.statusMessage = "OK";
                res.status(200).send();
                return;
            } else {
                res.statusMessage = "Bad Request";
                res.status(400).send();
                return;
            }
        }

        } catch (err) {
            res.statusMessage = "Internal Server Error";
            res.status(500).send(err);
            return;
        }
    }

