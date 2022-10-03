const app = require('express');
const weatherData = require('./weather-route.js');

const router = app.Router();
router.use(`/${weatherData.uri}`, weatherData.router);

module.exports = {
    routes: router
};
