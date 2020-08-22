const db = require('../../config/db');

exports.getAll = async function(petitionId) {
    const connection = await db.getPool().getConnection();
    let q =
        'SELECT ' +
        'signatory_id AS signatoryId, ' +
        'User.name AS name, ' +
        'User.city AS city, ' +
        'User.country AS country, ' +
        'signed_date AS signedDate ' +
        'FROM Signature ' +
        'JOIN User ON User.user_id = signatory_id ' +
        'WHERE petition_id = ? ' +
        'ORDER BY signed_date';

    const [rows, _] = await connection.query(q, petitionId);
    connection.release();
    return rows;
};

exports.signPetition = async function(signatoryId, petitionId, signedDate) {
    const connection = await db.getPool().getConnection();
    const values =  [signatoryId, petitionId, signedDate]
    const q = "INSERT INTO Signature (signatory_id, petition_id, signed_date) VALUES (?, ?, ?)";
    const [rows, _] = await connection.query(q, values);
    connection.release();
    return null;
}

exports.deleteSignature = async function (signatoryId, petitionId) {
    const connection = await db.getPool().getConnection();
    const values = [signatoryId, petitionId];
    const q = "DELETE FROM Signature WHERE signatory_id = ? AND petition_id = ?";
    await connection.query(q, values);
    connection.release();
    return null;
}