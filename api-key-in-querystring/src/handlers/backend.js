const axios = require('axios');

exports.lambda_handler = async (event) => {
    console.log('backend:: lambda_handler:: event: ', event.body);
    let ip;
    let res = {};
    try {
        const result = await axios.get('http://checkip.amazonaws.com/');
        ip = result.data;
        console.log('backend:: lambda_handler:: ip data', ip);
        res = {
            statusCode: 200,
            body: JSON.stringify({
                "data": event.body,
                "message": "Hello from Lambda backend.",
                "yourIpAddress": ip
            })
        }
    } catch (error) {
        console.error('backend:: lambda_handler::', error);
        res = {
            statusCode: 400,
            body: JSON.stringify({
                "message": `backend:: lambda_handler:: ${error}`
            })
        }
    }

    return res;
};