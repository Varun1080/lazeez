const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        foodId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'FoodProduct',
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  personal: {
    info: [
      {
        name: { type: String },
        phone: { type: String },
        Age: { type: String },
        address: { type: String },
        gender: { type: String },
        Email:{type:String},
        DateOfBirth:{type:String}
      },
    ],
  },
});

userSchema.methods.addToCart = function (productId) {
  const existingIndex = this.cart.items.findIndex((elem) => {
    return elem.foodId.toString() === productId.toString();
  });

  if (existingIndex != -1) {
    const qnt = this.cart.items[existingIndex].quantity;
    this.cart.items[existingIndex].quantity = qnt + 1;
  } else {
    this.cart.items.push({ foodId: productId, quantity: 1 });
  }
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const __arr = this.cart.items.filter((elem) => {
    return productId.toString() !== elem._id.toString();
  });

  this.cart.items = __arr;

  return this.save();
};

userSchema.methods.emptyCart = function () {
  const __newarr = [{}];
  this.cart.items = __newarr;
  return this.save();
};

userSchema.methods.postSetting=function(__obj)
{
  this.personal.info[0]=__obj;
  return this.save();
}

userSchema.methods.getSetting = function () {
  return this.personal.info;
};

module.exports = mongoose.model('User', userSchema);
