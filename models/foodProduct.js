const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const foodSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    foodUrl:{
        type:String,
        required:true
    },
    foodDesc:{
        type:String,
        required:true
    },
    foodSeason:{
        type:String,
        required:true
    },
    foodCategory:{
        type:String,
        required:true
    },
    foodSubCategory:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
})

module.exports = mongoose.model('FoodProduct',foodSchema);