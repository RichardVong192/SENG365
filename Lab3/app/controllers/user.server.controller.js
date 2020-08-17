// Import the User model and contain the six functions that are called by the routes file.

const User = require('../models/user.server.model');

exports.list = async function(req, res){
    try{
        const result = await User.getAll();
        res.status(200)
            .send(result);
    } catch (err){
        res.status(500)
            .send(`ERROR getting users ${err}`);
    }
};

exports.create = async function(req, res){
    try {
        let user_data = {
            "username": req.body.username
        };

        let user = user_data['username'].toString();
        let values = [
            [user]
        ];

        const result = await User.insert(values);
        res.status(201)
            .send(`Inserted ${req.body.username} at id ${result}`);
    } catch (err) {
        res.status(500)
            .send(`ERROR posting user ${err}`);
    }
};

exports.read = async function(req, res){
    try {
        const id = req.params.userId;
        const result = await User.getOne(id);
        res.status(200)
            .send(result)
    } catch (err){
        res.status(500)
            .send(`ERROR putting user ${err}`);
    }
};

exports.update = async function(req, res){
    try {
        const id = req.params.userId;
        const username = req.body.username;
        const result = await User.alter(username, id);
        res.status(201)
            .send(`Inserted ${req.body.username} at id ${id}`);
    } catch (err) {
        res.status(500)
            .send(`ERROR altering user ${err}`);
    }
};

exports.delete = async function(req, res){
    try {
        const id = [req.params.userId];
        const result = await User.remove(id);
        res.status(200)
            .send('User successfully deleted from the database');
    } catch (err) {
        res.status(500)
            .send(`ERROR deleting user: ${err}`);
    }
};
exports.userById = async function(req, res){
    return null;
};