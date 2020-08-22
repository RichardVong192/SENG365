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

exports.putUsersPhoto = async function (userId, filename, request) {
    const connection = await db.getPool().getConnection();
    const values = [filename, userId];
    const q = 'UPDATE User SET photo_filename = ? WHERE user_id = ?';
    await connection.query(q, values);

    let path = exports.photoPath(filename)
    fs.writeFileSync(path, request);

    connection.release();
    return null;
}

exports.deleteUsersPhoto = async function (userId) {
    const connection = await db.getPool().getConnection();
    const q2 = 'SELECT photo_filename FROM User Where user_id = ?';
    let [rows2] = await connection.query(q2, userId);
    let userPhotoFilename = rows2[0].photo_filename;

    let values = [null, userId]
    const q = 'UPDATE User set photo_filename = ? WHERE user_id = ?';
    await connection.query(q, values);

    let path = exports.photoPath(userPhotoFilename);
    fs.unlinkSync(path)

    connection.release();
    return null;
}

exports.deletePhotoIfExists = async function (filename) {
    let path = exports.photoPath(filename)
    if (await fs.existsSync(path)) {
        await fs.unlinkSync(path)
    }
}