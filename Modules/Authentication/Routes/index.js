'use strict'

const express = require('express');
const router = express.Router();
const Guard = require('../../../Middleware/auth');
const AuthController = require('../Controllers/AuthenticationController');

router.post('/register', (req, res, next) => {
    AuthController.register( req, res, next);
});

router.patch('/activate/:id', (req, res, next) => {
    AuthController.activateUser( req, res, next);
});

router.post('/login', (req, res, next) => {
    AuthController.login( req, res, next);
});

router.get('/logout',[Guard.isValidUser], (req, res, next) => {
    AuthController.logout( req, res, next);
});

module.exports = router