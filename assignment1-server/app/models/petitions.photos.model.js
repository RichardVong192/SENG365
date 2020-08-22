const db = require('../../config/db');
const fs = require('fs');

exports.photoPath = function (filename) {
    let pathResult = (process.cwd() + '\\storage\\photos\\' + filename);
    return pathResult;
}

exports.getMimeType = function (contentType) {
    if (contentType === 'image/jpeg'){
        return '.jpg';
    } else if (contentType === 'image/png') {
        return '.png';
    } else if (contentType === 'image/gif') {
        return '.gif';
    }
}

exports.getPetitionsInfo = async function (petitionId) {
    const connection = await db.getPool().getConnection();
    const q = 'SELECT * FROM Petition WHERE petition_id = ?';
    let [rows, _] = await connection.query(q, petitionId);
    connection.release();
    return rows;
}

exports.putPetitionPhoto = async function (petitionId, filename, request) {
    const connection = await db.getPool().getConnection();
    const values = [filename, petitionId];
    const q = 'UPDATE Petition SET photo_filename = ? WHERE petition_id = ?';
    await connection.query(q, values);

    let path = exports.photoPath(filename)
    fs.writeFileSync(path, request);

    connection.release();
    return null;
}
