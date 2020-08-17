const photos = require('../controllers/users.photos.controller');

module.exports = function (app) {
    app.route(app.rootUrl + '/users/:user_id/photo')
        .get(photos.getUsersPhoto)
        .put(photos.putUsersPhoto)
        .delete(photos.deleteUsersPhoto);
};