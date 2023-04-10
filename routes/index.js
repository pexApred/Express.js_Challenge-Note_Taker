const express = require('express');

// Import our modular routers for /tips and /feedback
const dbRouter = require('./');

const app = express();

app.use('/tips', tipsRouter);

module.exports = app;