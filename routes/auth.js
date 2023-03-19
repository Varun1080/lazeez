// **************global packages
const express = require('express');
const { check, body } = require('express-validator');

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

router.post(
  '/sign-up',
  [
    check('userEmail').isEmail().withMessage('Please enter a valid email'),
    body('userPassword')
      .isLength({ min: 5 })
      .withMessage('Please enter a password with atleast 5 characters'),
    body('cUserPassword').custom((value,{req})=>{
        if(value!==req.body.userPassword)
        {
            return false;
        }
        else
        {
            return true;
        }
    }).withMessage("please enter same password")
  ],
  authController.postSignUp
);

router.post('/logout', authController.postLogout);

module.exports = router;
