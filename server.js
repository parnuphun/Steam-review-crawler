const scrap = require('./src/scrap')
const express = require('express')
const path = require('path')
const app = express()
const port = 4020

// scrap()
app.set('views', path.join(__dirname, 'views'))
app.set ("view engine", "ejs" )
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/',(req, res)=>{
    res.render('index')
})

app.listen(port || 3030 , ()=>{ 
    console.log(`server runing at port ${port} ...`)
})