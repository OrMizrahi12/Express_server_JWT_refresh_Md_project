const jwt = require('jsonwebtoken'); //#6


//============== #7 check and verify the token ==============

const verifyJWT = (req, res, next) => {

    // 1) we check if there is token in the headers   
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    // for get only the token!
    const token = authHeader.split(' ')[1];

//  2) we verify the token:
// we put: 
// - token --> the token
// - process.env.ACCESS_TOKEN_SECRET --> we need the code for verify this middle ware
// - callback func

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            //now, we set the user with the UserInfo( we passed there the JWT, remember?  ) 
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            // continu to next middleware
            next();
        }
    );
}

// now, lets protect on some route... 
// NOTE: if we want to scure some rout, we will go to server.js and put this middleware above the routs !

// for #8, go to server.js --->

module.exports = verifyJWT