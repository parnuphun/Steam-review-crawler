const express = require('express')
const exportCsv = require('./src/exportCsvFile')
const scrap = require('./src/scrap')
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
    let limit = req.body.limit
    let data = await scrap(url , limit)
    res.json(data);
})

app.post('/api/exportSteamReviewToCSV', async (req,res)=>{
    console.log('I n');
    let data = req.body.data
    let csvName = await exportCsv(data)
    
    const file = path.join(__dirname, 'public/csv/'+csvName);
    res.download(file)
})

app.listen(port || 3030 , ()=>{ 
    console.log(`server runing at port ${port} ...`)
})