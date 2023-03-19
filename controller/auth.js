// **********global modules
const bcrypt = require('bcryptjs');
const flash=require("connect-flash");

// ************local modules
const FoodProduct = require('../models/foodProduct');
const User = require('../models/user');
const Review = require('../models/review');

const getLogin = (req, res, next) => {
  return res.render('auth/login', {
    docTitle: 'Login Form',
    path: '',
  });
};

const postLogin = (req, res, next) => {
  const email = req.body.userEmail;
  const password = req.body.userPassword;

  const Find = async () => {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.redirect('/login');
    }
    const bool_ans =await bcrypt.compare(password, user.password);
    if (bool_ans) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(() => {
        return res.redirect('/');
      });
    } else {
      return res.redirect('/login');
    }
  };
  Find();
};

const postLogout = (req, res, next) => {
  req.session.destroy(() => {
    return res.redirect('/');
  });
};

const getSignUp = (req, res, next) => {
  return res.render('auth/sign-up.ejs', {
    docTitle: 'Sign Up Page',
    path: '',
  });
};

const postSignUp = (req, res, next) => {
  const email = req.body.userEmail;
  const password = req.body.userPassword;
  const cpassword = req.body.cUserPassword;

  const Find = async () => {
    try {
      const result = await User.findOne({ email: email });
      if (result) 
      {
        return res.redirect('/sign-up');
      }
      const hashedPass = await bcrypt.hash(password, 12);
      const user = new User({
        email: email,
        password: hashedPass,
        cart: {
          items: [],
        },
        personal:{
          info:[{name:"",phone:"",Age:"",address:"",gender:"",Email:email,DateOfBirth:""}]
        }

      });
      const data = await user.save();
      return res.redirect('/login');
    } catch (err) {
      if (err) return console.log(err.message);
    }
  };
  Find();
};

module.exports = { getLogin, postLogin, postLogout, getSignUp, postSignUp };
