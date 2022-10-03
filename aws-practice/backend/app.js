const os = require('os');
const server = require('./api/sever');

function updateCoreCount(core) {
    process.env.NODE_ENV = process.env.NODE_ENV || null;
    process.env.PORT = process.env.PORT || 3000;
    if (!process.env.NODE_ENV) {
        setTimeout(() => {
            process.exit(1);
        }, 1000);
    }
    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-param-reassign
        core.count = 1;
    }
}


(function startServer() {
    const apps = [];
    const core = { count: os.cpus().length };
    updateCoreCount(core);

    server.start()
        .then((theApp) => {
            apps.push(theApp);
            console.log('Instance started.');
        })
        .catch((err) => {
            console.log('Instance failed.', err);
            setTimeout(() => {
                process.exit(1);
            }, 1000);
        });
}());