/*
 Just for generating db, independently run, not link to app.js
 */
const{places,descriptors}=require('./seedHelpers')
const cities = require('./cities')
const Campground = require('../models/campground')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})
const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error:"))
db.once("open", () => {
    console.log("Databse Connected")
})

const sample=(arr) => arr[Math.floor(Math.random()*arr.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0;i<100;i++){
        const random = Math.floor(Math.random()*1000)
        const camp = new Campground({
            location: `${cities[random].city} ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`

        })
        await camp.save()
    }
}
seedDB();