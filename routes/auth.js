// **************global packages
const express = require('express');
const { check, body } = require('express-validator/check');

// *************local packages
const authController = require('../controller/auth');

const router = express.Router();

// **********for getting login page
router.get('/login', authController.getLogin);

// **********for posting login page
router.post('/login', authController.postLogin);

// ****************for getting sign-up page
router.get('/sign-up', authController.getSignUp);

// ***************for posting sign-up page

router.post('/sign-up',authController.postSignUp);

router.post('/logout', authController.postLogout);

module.exports = router;
