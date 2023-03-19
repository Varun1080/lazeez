// **************global pacakges
const express = require('express');
const isAuth = require('../middleware/is-auth');

// ***********local packages
const shopController=require("../controller/shop");
const router = express.Router();

router.get('/', shopController.getIndexPage);

router.get('/add-review', isAuth,shopController.getReview);

router.post('/add-review',isAuth,shopController.postReview);

router.get('/product-list',shopController.getProductList);

router.get('/cart',isAuth,shopController.getCart);

router.post('/add-to-cart', isAuth,shopController.addCart);

router.post('/delete-cart-item', isAuth,shopController.deleteCart);

router.get('/checkout',isAuth, shopController.getCheckOut);

router.get('/checkout/success',shopController.getCheckOutSuccess );

router.get('/checkout/cancel',shopController.getCheckOutCancel);

router.get('/product-detail/:productId',shopController.getProductDetail);

router.get('/setting',isAuth,shopController.getSetting);

router.get('/edit-profile/:id',isAuth,shopController.getEdit)

router.post('/edit-profile',isAuth,shopController.postEdit)

module.exports = router;
