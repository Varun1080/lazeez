// **********global modules
const bcrypt = require('bcryptjs');
const flash=require("connect-flash");
const {validationResult}=require("express-validator")

// ************local modules
const FoodProduct = require('../models/foodProduct');
const User = require('../models/user');
const Review = require('../models/review');

const getLogin = (req, res, next) => {
  return res.render('auth/login', {
    docTitle: 'Login Form',
    path: '',
    errorMessage:req.flash('errorMessage'),
    _errorMessage:req.flash('_errorMessage')
  });
};

const postLogin = (req, res, next) => {
  const email = req.body.userEmail;
  const password = req.body.userPassword;

  const Find = async () => {
    const user = await User.findOne({ email: email });
    if (!user) {
      const result=await req.flash('errorMessage','Email do not match in database');
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
      const result = await req.flash('_errorMessage','Invalid password');
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
    errorMessage1:req.flash('error'),
    errorMessage:null,
    _errorMessage:null,
    __errorMessage:null
  });
};

const postSignUp = (req, res, next) => {
  const email = req.body.userEmail;
  const password = req.body.userPassword;
  const cpassword = req.body.cUserPassword;
  const {errors}=validationResult(req);

  const _errors=[null,null,null];

  for(let i=0;i<errors.length;i++)
  {
    if(errors[i].param=="userEmail")
    {
      _errors[0]=errors[i].msg;
    }
    else if(errors[i].param=="userPassword")
    {
      _errors[1]=errors[i].msg;
    }
    else if(errors[i].param=="cUserPassword")
    {
      _errors[2]=errors[i].msg;
    }
  }

  if(errors.length>0)
  {
    return res.status(422).render('auth/sign-up',{
      docTitle:"Sign Up Page",
      path:'',
      errorMessage1:req.flash('error'),
      errorMessage:_errors[0],
      _errorMessage:_errors[1],
      __errorMessage:_errors[2]
    })
  }
  const Find = async () => {
    try {
      const result = await User.findOne({ email: email });
      if (result) 
      {
        const result=await req.flash('error',"Email already exist in database");
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
