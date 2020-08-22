// Import the database config file and the following instructions.

const db = require('../../config/db');

exports.getAllPetitions = async function (startIndex, count, qTerm, categoryId, authorId, sortBy) {
    const connection = await  db.getPool().getConnection();
    let values  = [];
    let categoryIdQueryString = "";
    let authorIdQueryString = "";

    if (!(authorId === null ))  {
        authorIdQueryString = "AND Petition.author_id = ?"
        values.push(authorId);
    }

    if (!(categoryId === null)) {
        categoryIdQueryString = "AND Petition.category_id = ? ";
        values.push(categoryId);
    }

    if (sortBy === "ALPHABETICAL_ASC") {
        sortBy = "title ASC";
    } else if (sortBy === "ALPHABETICAL_DESC") {
        sortBy = "title DESC";
    } else if (sortBy === "SIGNATURES_ASC") {
        sortBy = "signatureCount ASC";
    } else {                                    // FOR SIGNATURE DESC
        sortBy = "signatureCount DESC";
    }

    values.push("%" + qTerm + "%");
    values.push(parseInt(startIndex));
    values.push(parseInt(count));

    const q =
        "SELECT Petition.petition_id AS petitionId, " +
        "Petition.title AS title, " +
        "Category.name AS category, " +
        "User.name AS authorName, " +
        "COUNT(Signature.signatory_id) AS signatureCount " +
        "FROM Petition " +
        "JOIN Signature ON Signature.petition_id = Petition.petition_id " +
        "JOIN User ON User.user_id = Petition.author_id " + authorIdQueryString + " " +
        "JOIN Category ON Category.category_id = Petition.category_id " + categoryIdQueryString + " " +
        "WHERE Petition.title LIKE ? " +
        "GROUP BY Petition.petition_id " +
        "ORDER BY " + sortBy + " " +
        "LIMIT ?, ? ";

    const [rows, _] = await connection.query(q, values);
    connection.release();
    return rows;
}

exports.getAllCategoryIds = async function () {
    const connection = await db.getPool().getConnection();
    const q = "SELECT category_id FROM Category"
    const [rows, _] = await connection.query(q);
    connection.release();
    return rows;
}


exports.addPetitions = async function (title, description, authorId, categoryId, createdDate, closingDate){
    const connection = await db.getPool().getConnection();
    const values = [title, description, authorId, categoryId, createdDate, closingDate];
    const q = "INSERT INTO Petition (title, description, author_id, category_id, created_date, closing_date) VALUES (?, ?, ?, ?, ?, ?)";
    const [rows, _] = await connection.query(q, values);

    let jsonResult =
        {
            "petitionId": rows.insertId
        }

    connection.release();
    return jsonResult;
}



exports.getPetitions = async function (petition_id) {
    const connection = await db.getPool().getConnection();
    const q =
        "SELECT Petition.petition_id AS petitionId, " +
        "Petition.title AS title, " +
        "Petition.description AS description, " +
        "Petition.author_id as authorId, " +
        "User.name AS authorName, " +
        "User.city as authorCity, " +
        "User.country as authorCountry, " +
        "COUNT(Signature.signatory_id) AS signatureCount, " +
        "Category.name AS category, " +
        "Petition.created_date as createdDate, " +
        "Petition.closing_date as closingDate " +
        "FROM Petition " +
        "JOIN Signature ON Signature.petition_id = Petition.petition_id " +
        "JOIN User ON User.user_id = Petition.author_id " +
        "JOIN Category ON Category.category_id = Petition.category_id " +
        "WHERE Petition.petition_id = ? " ;

    const [rows, _] = await connection.query(q, petition_id)
    connection.release();
    return rows;
}

exports.patchPetitions = async function (reqBody, petitionId){
    const connection = await db.getPool().getConnection();
    let q = "UPDATE Petition SET ";
    let values = [];

    //Build up sql string
    if (reqBody.title) {
        q += ("title = ?, ");
        values.push(reqBody.title);
    }
    if (reqBody.description) {
        q += ("description = ?, ");
        values.push(reqBody.description);
    }
    if (reqBody.categoryId) {
        q += ("category_id  = ?, ");
        values.push(reqBody.categoryId);
    }
    if (reqBody.closing_date) {
        q += ("closing_date = ? ")
        values.push(reqBody.closing_date);
    }
    q = q.slice(0, q.length-2);
    q += (" WHERE petition_id = ?");
    values.push(parseInt(petitionId));

    if (values.length <= 1){
        connection.release();
        return false; // if no changes 400 error
    }

    let [rows, _] = await connection.query(q, values);
    connection.release();
    return true;
}

exports.deletePetition = async function (petitionId) {
    const connection = await db.getPool().getConnection();
    let q = "DELETE FROM Petition WHERE petition_id = ?"
    let [rows, _] = await connection.query(q, petitionId);
    connection.release();
    return null;
}

exports.getCategories = async function () {
    const connection = await db.getPool().getConnection();
    let q = "SELECT category_id AS categoryId, name FROM Category"
    const [rows, _] = await connection.query(q);
    connection.release();
    return rows;
}