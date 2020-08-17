const petitionSignature = require('../controllers/petitions.signatures.controller');

module.exports = function (app) {

    app.route(app.rootUrl + '/petitions/:id/signatures')
        .get(petitionSignature.getAllPetitionSignatures);

    app.route(app.rootUrl + '/petitions/:id/signatures')
        .post(petitionSignature.signPetition);

    app.route(app.rootUrl + '/petitions/:id/signatures')
        .delete(petitionSignature.deletePetition);

};