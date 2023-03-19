// ************local modules
const FoodProduct = require('../models/foodProduct');
const User = require('../models/user');
const Review = require('../models/review');

// **********getting food addding page
const getAddRecipe = (req, res, next) => {
  return res.status(200).render('admin/add-recipe', {
    docTitle: 'Add Recipe Page',
    isAuthenticated: req.session.isLoggedIn,
    enable:(req.session.user==null || req.user.email!="vs343171@gmail.com")?false:true,
  });
};


// **********posting food adding page
const postAddRecipe = (req, res, next) => {
    const v=req.body;
    const name=v.foodName;
    const price=v.foodPrice;
    const foodUrl=v.foodUrl;
    const foodDesc=v.foodDesc;
    const foodSeason=v.foodSeason;
    const foodCategory=v.foodCategory;
    const foodSubCategory=v.foodSubCategory;
    const userId=req.user._id;

  const foodproduct = new FoodProduct({name:name,price:price,foodUrl:foodUrl,foodDesc:foodDesc,foodSeason:foodSeason,foodCategory:foodCategory,foodSubCategory:foodSubCategory,userId:userId});

  const Save = async () => {
    try {
      const result = await foodproduct.save();
      return res.redirect('/');
    } catch (err) {
      if (err) return console.log(err.message);
    }
  };

  Save();
};

module.exports = { getAddRecipe, postAddRecipe };
