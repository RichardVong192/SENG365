const petition = require('../controllers/petition.controller');

module.exports = function (app) {

    app.route(app.rootUrl + '/petitions/categories')
        .get(petition.getCategories);

    app.route(app.rootUrl + '/petitions')
        .get(petition.getAllPetitions);

    app.route(app.rootUrl + '/petitions')
        .post(petition.addPetitions);

    app.route(app.rootUrl + '/petitions/:petition_id')
        .get(petition.getPetitions);

    app.route(app.rootUrl + '/petitions/:petition_id')
        .patch(petition.patchPetitionsId);

    app.route(app.rootUrl + '/petitions/:petition_id')
        .delete(petition.deletePetition);

};