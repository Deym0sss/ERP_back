const {Router}= require("express");
const {check} = require('express-validator');
const router = new Router();
const AuthController = require('../controllers/authController')

router.post(
    '/register',
    [
        check('email','Incorrect email').isEmail(),
        check('password','Incorrect password').isLength( {min: 6}),
    ], 
    AuthController.registration)

router.post(
    '/login',
    [
        check('email','Incorrect email').normalizeEmail().isEmail(),
        check('password','Incorrect password').isLength( {min: 6}),
    ],
    AuthController.login)

module.exports = router