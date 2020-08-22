const db = require('../../config/db');
const bcrypt = require("bcrypt");

const saltRounds = 5;

// Hashes the password
exports.hash = function(password){
    return bcrypt.hashSync(password, saltRounds);
}

// Validates the password
exports.validate = function (password, hash) {
    return bcrypt.compareSync(password, hash);
}