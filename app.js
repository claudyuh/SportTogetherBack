//Requirements
const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const bodyParser = require('body-parser');

// Uses
const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
  }));

require('dotenv').config();
require('colors');

// Database
const mongoCloud = process.env.MONGO_API
mongoose.connect(mongoCloud, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("Database connected".bgYellow.black))
.catch(err => {console.log('Connection error: ', err)});

// middleware for allowing cross site
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH')
//     next()
// })


// routes

app.use('/', userRoutes)

app.use('/', eventRoutes)

// error handler

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

// server
app.listen(5000, () => {
    console.log('Backend server connected with port 5000'.bgBlue.black)
})