// Import a users controller and then define each of the relevant routes as outlined in the specification.
// Each route calls a function in our controller.
// Another controller function is used for retrieving a user from the ID that is specified in the URL.

const users = require('../controllers/user.server.controller');

module.exports = function(app){
    app.route('/api/users')
        .get(users.list)
        .post(users.create);
    app.route('/api/users/:userId')
        .get(users.read)
        .put(users.update)
        .delete(users.delete);
};
