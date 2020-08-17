// Import the database config file and the following instructions.

const db = require('../../config/db');
const passwords = require('../models/passwords.models');

exports.register = async function(myName, myEmail, myPassword, myCity, myCountry) {
    const connection = await db.getPool().getConnection();
    const values = [myName, myEmail, myPassword, myCity, myCountry];
    const q = 'INSERT INTO User (name, email, password, city, country) VALUES (?, ?, ?, ?, ?)';
    const [result, _] = await connection.query(q, values);
    console.log(`Inserted user with id ${result.insertId}`);

    let jsonResult =
        {
            "userId" : result.insertId
        }

    connection.release();
    return jsonResult;
};

exports.checkUniqueEmail = async function (email){
    const connection = await db.getPool().getConnection();
    const q = 'SELECT * FROM User WHERE email = ?';
    const [rows, _] = await connection.query(q, email);
    connection.release();
    return rows;
}

exports.login = async function(email, password, token) {
    const connection = await db.getPool().getConnection();
    let values = [token, email];
    let q = 'UPDATE User SET auth_token = ? WHERE email = ?';
    let [rows, _ ] = await connection.query(q, values);

    // Select password from db to validate against plaintext password
    let q2 = 'SELECT password FROM User WHERE email = ?';
    [rows, _ ] = await connection.query(q2, email);

    if (rows.length === 0) {
        connection.release();
        return undefined
    }

    let hashedPassword = rows[0].password;

    if (passwords.validate(password, hashedPassword)) {
        q = 'SELECT user_id, auth_token FROM User WHERE email = ?';
        [rows, _] = await connection.query(q, email);

        connection.release();
        return rows[0];
    } else {
        connection.release();
        return undefined
    }

}

exports.logout = async function(xAuthToken){
    const connection = await db.getPool().getConnection();
    let values = [xAuthToken];
    let q = "UPDATE User SET auth_token = NULL WHERE auth_token = ? "
    let [rows, _] = await connection.query(q, values);
    connection.release();
    return rows;
};


exports.getUser = async function(xAuthToken, user_id) {
    const connection = await db.getPool().getConnection();
    let values = [user_id]
    let q = "SELECT name, city, country, email, auth_token FROM User WHERE user_id = ?";
    let [rows, _] = await connection.query(q, values);
    if (rows[0] === undefined) {
        connection.release();
        return rows[0];
    }
    let jsonResponse =
        {
            "name": rows[0].name,
            "city": rows[0].city,
            "country": rows[0].country
        };
    if (xAuthToken == null) {
        connection.release();
        return jsonResponse;
    } else if (xAuthToken == rows[0].auth_token) {
        jsonResponse =
            {
                "name": rows[0].name,
                "city": rows[0].city,
                "country": rows[0].country,
                "email": rows[0].email
            };
        return jsonResponse;
    }
    connection.release();
    return jsonResponse;

}

exports.changePasswordCheck = async function(password, user_id){
    const connection = await db.getPool().getConnection();
    let values = [password, user_id]
    const q = 'SELECT * FROM User WHERE password = ? AND user_id = ?';
    const [rows, _] = await connection.query(q, values);
    connection.release();
    return rows;
}

exports.getUserIdFromToken = async function(token){
    const connection = await db.getPool().getConnection();

    if (token == null || token == undefined) {
        connection.release();
        return null; // Not authenticated
    }

    const q = 'SELECT user_id FROM User WHERE auth_token = ?';
    const [rows, _] = await connection.query(q, token);

    if (rows.length == 0) {
        connection.release();
        return null; // Finds no matches
    }

    connection.release();
    return rows[0].user_id;
}

exports.patchUserId = async function(reqBody, user_id, xAuthToken) {

    const connection = await db.getPool().getConnection();
    let values = [user_id]
    let q2 = "SELECT auth_token FROM User WHERE user_id = ?";
    let [rows, _] = await connection.query(q2, values);

    //BUILD UP SQL STRING
    var q = "UPDATE User SET  ";
    values = [];

    if (reqBody.name) {
        q += ("name = ?, ");
        values.push(reqBody.name);
    }
    if (reqBody.email) {
        q += ("email = ?, ");
        values.push(reqBody.email)
    }
    if (reqBody.password) {
        q += ("password = ?, ");
        values.push(reqBody.password)
    }
    if (reqBody.city) {
        q += ("city = ?, ");
        values.push(reqBody.city)
    }
    if (reqBody.country) {
        q += ("country = ?, ");
        values.push(reqBody.country);
    }
    q = q.slice(0, q.length-2);
    q += (" WHERE user_id = ?");
    values.push(parseInt(user_id));

    if (values.length <= 1){
        connection.release();
        return false; // if no changes 400 error
    }

    let q3 = "SELECT password FROM User WHERE user_id = ?";
    [rows, _] = await connection.query(q3, user_id);
    let hashedPassword = rows[0].password;
    if (passwords.validate(reqBody.currentPassword, hashedPassword) === false) {
        connection.release();
        return false;  // if incorrect password give 400 error.
    }

    [rows, _] = await connection.query(q, values);
    connection.release();
    return true; // If successful
};

exports.getUserUsingId = async function (userId) {
    const connection = await db.getPool().getConnection();
    const q = 'SELECT * FROM User WHERE user_id = ?';
    const [rows, _] = await connection.query(q, userId);
    connection.release();
    return rows;
}

