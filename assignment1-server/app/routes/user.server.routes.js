// Imports a users controller and define each of the relevant routes as outlined in the specification.
// Each route calls a function in our controller.
// Another controller function is used for retrieving a user from the ID that is specified in the URL.

const users = require('../controllers/user.server.controller');

module.exports = function(app) {
    app.route(app.rootUrl + '/users/register')
        .post(users.register);

    app.route(app.rootUrl + '/users/login')
        .post(users.login);

    app.route(app.rootUrl + '/users/logout')
        .post(users.logout);

    app.route(app.rootUrl + '/users/:user_id')
        .get(users.getUser);

    app.route(app.rootUrl + '/users/:user_id')
        .patch(users.patchUserId);
};