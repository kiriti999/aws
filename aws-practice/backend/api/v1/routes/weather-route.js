const express = require('express')
const ROUTE_URI = 'weather-data';
const router = express.Router();
const http = require('https');

function httpGet(options) {
    return new Promise((resolve, reject) => {
        http.get(options, function (resp) {
            resp.setEncoding('utf8');
            let body = [];
            resp.on('data', async function (chunk) {
                body.push(chunk);
            });
            resp.on('end', function () {
                try {
                    body = JSON.parse((body).toString());
                } catch (e) {
                    reject(e);
                }
                resolve(body);
            });
        }).on("error", function (e) {
            console.log("Got error: " + e.message);
        });
    });
}

async function getWeatherData(req, res) {
    try {
        console.log('Getting weather..');
        var options = {
            host: 'openweathermap.org',
            port: 443,
            path: '/data/2.5/find?q=London&appid=439d4b804bc8187953eb36d2a8c26a02&units=metric'
        };
        global.allWeatherData = await httpGet(options);
        res.status(200).json(allWeatherData);
    } catch (error) {
        console.log(error);
    }
}

function getWeatherByCity(req, res) {
    try {
        const { city } = req.query;
        console.log('Getting city...', city);
        const cityData = data.list.filter((value) => value.name === city);
        if (cityData.length) {
            res.status(200).json(cityData)
        } else {
            res.status(404).json({ status: "404", message: "city not found" });
        }

    } catch (error) {
        console.log(error);
    }
}

const routes = {
    getWeatherData,
    getWeatherByCity
};

router.get('/', (routes.getWeatherData));
router.get('/city', (routes.getWeatherByCity));

module.exports = {
    uri: ROUTE_URI,
    router
};