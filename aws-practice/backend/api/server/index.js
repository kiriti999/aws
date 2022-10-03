/**
 * The server.js file provides the startup of the
 * application/web server and resources
 * in this case mongo and redis.
*/
const express = require('express');
const initExpressApp = require('./init-app');

let app;
let httpServer = null;

/**
 * Starts the http server
 * @returns {Promise.<http.Server>}
 */
async function startHttpServer() {
    return new Promise((resolve) => {
        console.log('Started listening to port %s', process.env.PORT);
        resolve(app.listen(process.env.PORT));
    });
}

/**
 * What port is the server running on?
 */
function port() {
    return httpServer.address().port;
}

// /**
//  * shutdown like start contains a single call to cleanly shutdown the application.
//  * @returns {Promise.<void>}
//  */
// async function shutdown() {
//     try {
//         await shutdownHttpServer();
//         await resources.close();
//     } catch (err) {
//         utils.echo(err);
//     }
// }

async function start() {
    try {
        app = express();
        await initExpressApp(app);
        httpServer = await startHttpServer();
        return { app, httpServer };
    } catch (err) {
        throw err;
    }
}

module.exports = {
    start,
    port
};
