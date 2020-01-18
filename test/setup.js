const {expect} = require('chai');
const request = require('supertest');
process.env.NODE_ENV = 'test';
require('dotenv').config();

global.expect = expect;
global.request = request;