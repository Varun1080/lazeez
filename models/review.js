const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true,ref:'User'},
    desc: { type: String, required: true },
    date:{type:String,required:true}
});


// reviewSchema.methods.addReview

module.exports=mongoose.model('Review',reviewSchema);