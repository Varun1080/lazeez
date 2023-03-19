// ********global packages
const fs = require('fs');
const https=require("https");
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const flash = require('connect-flash');

const app = express();

// ********local pages
const path = require('path');
const shopRoute = require('./routes/shop');
const adminRoute = require('./routes/admin');
const authRoute = require('./routes/auth');
const User = require('./models/user');

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

// **********port number
const port = process.env.PORT || 3000;

// ************mongoose setting
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.aepfp1x.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

// **********session part -1
const store = new MongoDBStore({
  uri: uri,
  collection: 'sessions',
});

      
app.use(
  session({
    secret: 'my secret key',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      if (err) return console.log(err.message);
    });
});

// ************template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// *************compressor middleware
app.use(compression());

// *****************flash middleware
app.use(flash());

// ****************morgan middleware
app.use(morgan('combined',{stream:accessLogStream}));

// **************middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// *************every middleware
app.use(shopRoute);
app.use('/admin', adminRoute);
app.use(authRoute);

app.use((req, res, next) => {
  res.status(404).render('error/error', {
    docTitle: 'Error Page',
  });
});

// *********mongoose connection and app connection
mongoose
  .connect(uri)
  .then((result) => {
    app.listen(port, () => {
      console.log(`Listening to port number ${port}`);
    });
  })
  .catch((err) => {
    if (err) return console.log(err.message);
  });
