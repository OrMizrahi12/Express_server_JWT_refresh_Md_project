
// this is for CORS policy
// #20
const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
    // here we fet the origin
    const origin = req.headers.origin;

    // if origin is exsist, we send response that will resolve the CORS!!
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials

// for #21 go to sever.js --> 