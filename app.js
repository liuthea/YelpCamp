const express = require('express')
const app = express();
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const catchAsync=require('./Utils/catchAsync')
const ExpressError = require('./Utils/ExpressError')
const Campground = require('./models/campground')
const Review=require('./models/reviews')
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
const path = require('path')
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
const methodOverride = require('method-override');
const { urlencoded } = require('express');
const { EXDEV } = require('constants');
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.engine('ejs',ejsMate)
app.listen(3000,()=>{
    console.log('ON PORT 3000!')
})

app.get('/',(req,res) => {
    res.render('campgrounds/home')
})

app.get('/campgrounds',async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
})

app.get('/campgrounds/new', (req,res) =>{
    res.render('campgrounds/new')
 })

app.get('/campgrounds/:id',catchAsync(async (req,res)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id).populate('reviews');
    console.log(camp)
    res.render('campgrounds/show',{camp})
}))

app.post('/campgrounds',catchAsync(async (req,res) => {
    const camp = new Campground(req.body.campground)
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`)
    }
))

app.get('/campgrounds/:id/edit',catchAsync(async (req,res) => {
    const {id} = req.params
    const camp = await Campground.findById(id)
    res.render('campgrounds/edit',{camp})
}))

app.put('/campgrounds/:id', catchAsync(async (req,res) => {
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))

app.post('/campgrounds/:id/review',catchAsync(async(req,res) => {
    const review = new Review(req.body.review)
    await review.save();
    const camp = await Campground.findById(req.params.id);
    camp.reviews.push(review)
    await camp.save();
    res.redirect(`/campgrounds/${req.params.id}`)
}))

app.all('*',(req,res,next) => {
    next(new ExpressError('Page not found',404));
})

app.use((err,req,res,next) => {
    const{statusCode=500,message="something wrong"} = err
    res.status(statusCode).send(message)
})