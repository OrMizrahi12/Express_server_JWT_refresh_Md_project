const User = require('../model/User');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken'); //#1

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);

        // create JWTs
        //    ---------------------

        // ============== #2 ACCESS TOKEN:============== 

        // in jwt.sign we need put peyload:

        // - the user that logged in (foundUser.username)
        // - the role (pormitions)
        // - the code we created: ACCESS_TOKEN_SECRET in env file
        // - expiresIn (time for token)

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '60s' }
        );
        // ============== end #2 ============== 

        // ============== #3 REFRESH TOKEN ==============

        // in jwt.sign we need put peyload:

        //  - the user that logged in (foundUser.username)
        // - the code we created: REFRESH_TOKEN_SECRET in env file
        // - expiresIn (time for token)

        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // ============== end #3 ============== 

        // ============== #4 Saving refreshToken ==============

        // Saving refreshToken with current user

        // 1) we put the refresh Token in the user object -->
        //  ( foundUser.refreshToken = refreshToken)

        // 2) after we put the refresh token in the user, we SAVE the object in mongo! 
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        // ============== end #4 ============== 


        // ============== #5 Creates Secure Cookie with refresh token ==============
 
        // 1)
        // אנחנו נרצה לשלוח את התוקן שלנו כעוגייה, כדי שיישמר בצד לקוח
        // ידוע לנו שלשמור תוקן בעוגיה, זה לא בטיחותי ופריץ
        // if we send the cooki as httpOnly, it wil not be availble to JS
        // httpOnly ---> לכן אנחנו נשתמש בפרוטוקול זה, כדי שלא יהיה פריץ לגישה ב ג'אבה סקריפט
        // httpOnly --> is good way to save the token in clien then save it in localStorage
        // more info: ---> https://owasp.org/www-community/HttpOnly

        // 2) maxAge: 24 * 60 * 60 * 1000 --> expires of one day
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); // secure: true

        // 3) Send authorization roles and access token to user
        //  that the devaloper on clien side can grab it
        res.json({ roles, accessToken });

    } else {
        res.sendStatus(401);
    }
    // ==========================================
    // ---> to #6 go to verifyJWT.js 
}

module.exports = { handleLogin };