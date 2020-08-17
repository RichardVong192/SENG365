const mysql = require( 'mysql2/promise' );
require( 'dotenv' ).config( { path: '../.env' } );
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const app = express();
app.use( bodyParser.json() );

const pool = mysql.createPool( {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATA_BASE
} );

//Request all users from the database
async function getUsers(req,res){
    console.log('Request to get all users from the database');

    try{
        const connection = await pool.getConnection();
        console.log('Successfully connected to the database');

        const[rows, fields] = await connection.query('select * from lab2_users');
        res.status(200)
            .send(rows);
    } catch(error){
        res.status(500)
            .send('ERROR getting users: ${err}');
    }
}
app.get('/users', getUsers);


//Request single user from database
async function getSingleUsers(req,res){
    console.log('Request to get single user from the database');

    try{
        const connection = await pool.getConnection();
        console.log('Successfully connected to the database');
        const id = req.params.id;
        const[rows, fields] = await connection.query('select * from lab2_users where user_id = ?', [id]);
        res.status(200)
            .send(rows);
    } catch(error){
        res.status(500)
            .send('ERROR getting users: ${err}');
    }
}
app.get('/users/:id', getSingleUsers);

//Request new user to be added to database
async function postUser( req, res ) {
    console.log( 'Request to add a new user to the database' );
    try {
        const connection = await pool.getConnection();
        const sql = 'insert into lab2_users (username) values ( ? )';
        const values = [ req.body.username ];
        await connection.query( sql, [ values ] );
        res.status( 201 )
            .send(`User successfully added to the database`);
    } catch( err ) {
        res.status( 500 )
            .send( `ERROR posting user: ${ err }` )
    }
}
app.post( '/users', postUser );

//Request an edit to the user in the database
async function putUser(req, res){
    console.log('Request to edit an existing user to the database');
    try {
        const connection = await pool.getConnection();
        const sql = 'update lab2_users set username = ? where user_id = ?';
        const [result, _ ] = await connection.query(sql, [[req.body.username], [req.params.id]]);
        res.status(200)
            .send('User successfully updated to the database');
    } catch(err){
        res.status(500)
            .send(`ERROR updating user: ${ err }`)
    }
}
app.put('/users/:id', putUser);

//Request to delete user from database
async function deleteUser(req, res){
    console.log('Request to delete a user from the database');
    try {
        const connection = await pool.getConnection();
        const sql = 'DELETE FROM lab2_users WHERE user_id = ?';

        const values = [req.params.id];
        await connection.query(sql, [values]);
        res.status(200)
            .send('User successfully deleted from the database');
        } catch(err){
            res.status(500)
                .send(`ERROR deleting user: ${ err }`);
        }
}
app.delete('/users/:id', deleteUser);



//Run port
const port = process.env.PORT || 3001;
app.listen( port, () => {
    console.log( `Listening on port: ${ port }` );
} );

