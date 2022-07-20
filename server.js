require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');

// =============== #8 token===============
const verifyJWT = require('./middleware/verifyJWT'); //#8 
// =============== end #8 ===============

// =============== #10 cookie-parser===============
const cookieParser = require('cookie-parser'); // import 'cookie-parser' 
// =============== end #10 ===============


const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn'); 
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// ========= #21 ============
// we put this middleware here
// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);
// ========= end #21 ============

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

// ------------token------------

// =========== #11 middleware for cookies =============
app.use(cookieParser());
// for #12 go to refreshtokenController.js
// =========== end #11 =============


//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));

// ============= #14 =============
// /refresh will get the cookie (refresh token) and will create new access token!!
app.use('/refresh', require('./routes/refresh'));
// for #15 go to logoutController.js 
// ============= end #14 =============

// ============== #17 ================ 
// here we put the logout! 
// Above verifyJWT, which then checks to see if there is a token
app.use('/logout', require('./routes/logout'));
// for #18 go to allowedOrigin.js -->
// ============== end #17 ================ 



// =============== #9 token===============
//we put the middleware 'app.use(verifyJWT)' for scure this two routes! 
app.use(verifyJWT);
// only after verif the JWT we can get /employees & /users routs! 
app.use('/employees', require('./routes/api/employees'));
app.use('/users', require('./routes/api/users'));
// go to #10: line 10 in this file -->
//  =============== end #9 ===============

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});