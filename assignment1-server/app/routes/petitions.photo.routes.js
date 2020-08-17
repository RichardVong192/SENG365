const photos = require('../controllers/petitions.photos.controller');

module.exports = function (app) {
    app.route(app.rootUrl + '/petitions/:petition_id/photo')
        .get(photos.getPetitionsPhoto)
        .put(photos.putPetitionsPhoto);
};