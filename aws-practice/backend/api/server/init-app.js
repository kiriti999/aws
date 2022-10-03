const { routes } = require('../v1/routes');
const util = require('util');

const PARAMS = {
    basePath: '/api',
    supportedVersions: ['v1'],
    currentVersion: 'v1'
};

global.PARAMS = PARAMS;

function addApiRoutes(app) {
    app.use(util.format('%s/%s', PARAMS.basePath, PARAMS.currentVersion), routes);
}

function finalization(app) {
    // app.use(errorHandler);
    app.all('*', (res, err) => res.status(409).json(err));
}

async function initExpressApp(app) {
    addApiRoutes(app);
    // finalization(app);
}

module.exports = initExpressApp;