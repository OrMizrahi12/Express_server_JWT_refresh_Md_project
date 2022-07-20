const allowedOrigins = require('./allowedOrigins');   
//#19 
// we import the list, and chaek if the domain is allowed

const corsOptions = {
    origin: (origin, callback) => {
        // if the domain exsist in the list, we will send true!
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;

// for #20 go to credentials ---> 