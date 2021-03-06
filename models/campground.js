const mongoose = require('mongoose')
const Review=require('./reviews')
const Schema = mongoose.Schema;
const CampgroundSchema = new Schema({
        title:String,
        price:Number,
        description:String,
        image: String,
        location:String,
        reviews:[{type: Schema.Types.ObjectId,ref:"Review"}]
    })
module.exports=mongoose.model('Campground',CampgroundSchema)