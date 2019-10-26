require('dotenv').config();
const {NODE_ENV} = require('./config');
const express = require('express');
const morgan = require('morgan');
const cors = require ('cors');
const helmet = require('helmet');
const carrierRouter = require('./carriers/carriers-router');
const errorHandler = require('./middleware/error-handler');

const app = express();
const morganOptions = NODE_ENV === 'production' 
    ? 'tiny' 
    : 'common';
app.use(morgan(morganOptions));
app.use(helmet());
app.use(cors());

app.use(`/api`, carrierRouter);

app.use(errorHandler);
module.exports = app;