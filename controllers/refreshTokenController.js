const User = require('../model/User');
const jwt = require('jsonwebtoken'); // #12

//in authControllers.js, we SAVE the refreshToken in cookie!
  
const handleRefreshToken = async (req, res) => {

    // 1) we take All the data in the cookies
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    // 2) we take the refreshToken from cookies
    const refreshToken = cookies.jwt;
   // 3) now, we fine the user by refreshToken (the refreshToke'n user like the id of the user!)
   // by the spetsific refreshToken, we will fine the exacr user!
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 

    // #12 if we got here, foundUser is exsist!
    jwt.verify(

        // 1) the refreshToken we got from the cookie
        refreshToken,
        // 2) the secret code from env file
        process.env.REFRESH_TOKEN_SECRET,
        // 3) callback func

        (err, decoded) => {
           
            //  if the refrefh token is not vilde -->
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

            const roles = Object.values(foundUser.roles);

             // if we here, the refresh token is verify,
            // and now we can create new access Token!

            // ---------------------------
            // #12 create acsses token: 

            // exact like we did in authControllers.js!:
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '50min' }
            );
            // for respons, we need send the update token
            res.json({ roles, accessToken })
            // -------------------------------
        }
    );
}
// for #13, go to refresh.js --->
module.exports = { handleRefreshToken }