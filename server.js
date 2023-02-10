const scrap = require('./src/scrap')
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
const port = 4020

app.set('views', path.join(__dirname, 'views'))
app.set ("view engine", "ejs" )
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.get('/',(req, res)=>{
    let data = []
    res.render('index', { reviewsData: data });
})

app.post('/api/startScrapingSteamReview',async (req,res)=>{
    let url = req.body.url
    let data = await scrap(url)
    // res.render('index', { reviewsData: data });
    res.json(data);
})

app.listen(port || 3030 , ()=>{ 
    console.log(`server runing at port ${port} ...`)
})