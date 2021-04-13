const express = require('express')
const app = express();
const mongoose = require('mongoose')
const Campground = require('./models/campground')
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
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.listen(3000,()=>{
    console.log('ON PORT 3000!')
})

app.get('/campgrounds',async (req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
})

app.get('/campgrounds/new', (req,res) =>{
    res.render('campgrounds/new')
 })

app.get('/campgrounds/:id',async (req,res)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/show',{camp})
})

app.post('/campgrounds',async (req,res) => {
    const camp = new Campground(req.body.campground)
    console.log(req.body.campground)
    console.log(camp)
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`)
})

app.get('/campgrounds/:id/edit',async (req,res) => {
    const {id} = req.params
    const camp = await Campground.findById(id)
    res.render('campgrounds/edit',{camp})
})

app.put('/campgrounds/:id', async (req,res) => {
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${id}`)
})

app.delete('/campgrounds/:id', async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})