const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./route/route');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Load environment variables from .env file
require('dotenv').config();

// Connect to MongoDB
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);

// Configure middleware
app.use(cors({
    origin: [`${process.env.PORT}`],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        expires: 60 * 60 * 24
    },
}));

// Listen for errors and connections to the database
const database = mongoose.connection;
database.on('error', (error) => {
    console.log(error);
});
database.once('connected', () => {
    console.log('Database connected');
});

// Add routes
app.use('/api', routes);

// Listen for requests on port 3000
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
});