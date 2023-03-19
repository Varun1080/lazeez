// ***********global modules
const mongoose = require('mongoose');
const stripe=require("stripe")("sk_test_51MkLxDSGagux73Aj8NNwn3nX0pXqin1cZAlSJaoP2Hr73dNG2QpVrXcFCDcdvAt17wGOLYLvsN1Mwv7nhWSRR4DJ007RTDkJIH");

// ************local modules
const FoodProduct = require('../models/foodProduct');
const User = require('../models/user');
const Review = require('../models/review');

const ITEM_PER_PAGE=8;

const getIndexPage = (req, res, next) => {
  const Find = async () => {
    try {
      const result = await Review.find().populate('userId');
      const _result = await FoodProduct.find().limit(8);

      return res.status(200).render('shop/home', {
        docTitle: 'This is home page',
        prod: _result,
        prods: result,
        isAuthenticated: req.session.isLoggedIn,
        enable:(req.session.user==null || req.user.email!="vs343171@gmail.com")?false:true,
      });
    } catch (err) {
      if (err) return console.log(err.message);
    }
  };
  Find();
};

const getProductDetail = (req, res, next) => {
  const productId = req.params.productId;
  const Find = async () => {
    try {
      const data = await FoodProduct.find({ _id: productId });
      const _data = await FoodProduct.find({
        foodCategory: data[0].foodCategory,
      });

      return res.render('shop/product-detail', {
        docTitle: 'Product Detail Page',
        prods: data,
        releated: _data,
        isAuthenticated: req.session.isLoggedIn,
        enable:(req.session.user==null || req.user.email!="vs343171@gmail.com")?false:true,
      });
    } catch (err) {
      if (err) return console.log(err.message);
    }
  };
  Find();
};

const getProductList = (req, res, next) => {
  const page=req.query.page * 1 || 1;
  const Find = async () => {
    try {
      const data = await FoodProduct.find().skip((page-1) * ITEM_PER_PAGE).limit(ITEM_PER_PAGE);
      const cnt=await FoodProduct.countDocuments();
      return res.render('shop/product-list', {
        docTitle: 'Product List Page',
        prod: data,
        isAuthenticated: req.session.isLoggedIn,
        enable:(req.session.user==null || req.user.email!="vs343171@gmail.com")?false:true,
        currentPage:page,
        hasNextPage:ITEM_PER_PAGE * page < cnt,
        hasPreviousPage:page>1,
        nextPage:page+1,
        previousPage:page-1,
        lastPage:Math.ceil(cnt/ITEM_PER_PAGE)
      });
    } catch (err) {
      if (err) return console.log(err.message);
      s;
    }
  };
  Find();
};

const getSetting = (req, res, next) => {
  const Find = async () => {
    try {
      const data = await req.user.getSetting();
      return res.status(200).render('shop/setting', {
        docTitle: 'General Setting Page',
        isAuthenticated: req.session.isLoggedIn,
        id: req.user._id,
        prods: data,
        enable:(req.session.user==null || req.user.email!="vs343171@gmail.com")?false:true,
      });
    } catch (err) {
      if (err) return console.log(err.message);
    }
  };
  Find();
};

const getEdit = (req, res, next) => {
  const Find = async () => {
    try {
      const data = await req.user.getSetting();
      return res.render('shop/edit-setting', {
        docTitle: 'Edit Setting Page',
        prods: data,
        enable:(req.session.user==null || req.user.email!="vs343171@gmail.com")?false:true,
      });
    } catch (err) {
      if (err) return console.log(err.message);
    }
  };

  Find();
};

const postEdit = (req, res, next) => {
  const obj = req.body;
  const Find = async () => {
    try {
      const data = await req.user.postSetting(obj);
      return res.redirect('/setting');
    } catch (err) {
      if (err) return console.log(err.message);
    }
  };
  Find();
};

const getReview = (req, res, next) => {
  return res.status(200).render('shop/review', {
    docTitle: 'Add Your Review Here',
    enable:(req.session.user==null || req.user.email!="vs343171@gmail.com")?false:true,
  });
};

const postReview = (req, res, next) => {
  const _obj = req.body.userReview;
  const review = new Review({
    userId: req.user._id,
    desc: _obj,
    date: new Date().toDateString(),
  });

  const Find = async () => {
    try {
      const result = await review.save();
      return res.redirect('/');
    } catch (err) {
      if (err) return console.log(err.message);
    }
  };
  Find();
};

const getCheckOutSuccess = (req, res, next) => {
  return res.render('shop/success', {
    docTitle: 'Success Page',
  });
};

const getCheckOutCancel = (req, res, next) => {
  return res.render('shop/fail', {
    docTitle: 'Oops error occuured',
  });
};

const getCart = (req, res, next) => {
  const Cart = async () => {
    try {
      const result = await req.user.populate('cart.items.foodId');
      return res.render('shop/cart', {
        path: '/cart',
        docTitle: 'Your Cart Items',
        prods: result.cart.items,
        isAuthenticated: req.session.isLoggedIn,
        enable:(req.session.user==null || req.user.email!="vs343171@gmail.com")?false:true,
      });
    } catch (err) {
      if (err) return console.log(err.message);
    }
  };
  Cart();
};

const getCheckOut = (req, res, next) => {
  const Cart = async () => {
    try {
      const result = await req.user.populate('cart.items.foodId');
      console.log(result.cart.items);
      let total = 0;
      result.cart.items.forEach((p) => {
        total = total + p.quantity * p.foodId.price * 1;
      });
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        // *************
        line_items: result.cart.items.map((p) => {
          return {
            price_data: {
              currency: 'inr',
              unit_amount: p.foodId.price * 100,
              product_data: {
                name: p.foodId.name,
                description: p.foodId.foodDesc,
                images: [p.foodId.foodUrl],
              },
            },
            quantity: p.quantity,
          };
        }),

        // *************************
        mode: 'payment',
        success_url:
          req.protocol + '://' + req.get('host') + '/checkout/success',
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
      });
      return res.render('shop/checkout', {
        path: '',
        docTitle: 'Checkout Page',
        prods: result.cart.items,
        isAuthenticated: req.session.isLoggedIn,
        enable:(req.session.user==null || req.user.email!="vs343171@gmail.com")?false:true,
        totalSum: total,
        sessionId: session.id,
      });
    } catch (err) {
      if (err) return console.log(err.message);
    }
  };
  Cart();
};

const addCart = (req, res, next) => {
  const productId = req.body.productId;
  req.user.addToCart(productId);
  res.redirect('/cart');
};

const deleteCart = (req, res, next) => {
  const productId=req.body.productId;
  req.user.removeFromCart(productId);
  return res.redirect("/cart");
};

module.exports = {
  getIndexPage,
  getProductDetail,
  getProductList,
  getCheckOutCancel,
  getCheckOutSuccess,
  getSetting,
  getEdit,
  postEdit,
  getReview,
  postReview,
  getCart,
  addCart,
  deleteCart,
  getCheckOut
};
