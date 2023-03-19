// **************global packages
const express = require('express');

// ************local packages
const adminController=require("../controller/admin");

const router = express.Router();

router.get('/add-recipe', adminController.getAddRecipe);

router.post('/add-recipe', adminController.postAddRecipe);

module.exports = router;
