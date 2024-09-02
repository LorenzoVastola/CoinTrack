const { MongoClient } = require('mongodb')
const uri_db = 'mongodb://localhost:27017/'
const dbname = 'datingapp'
const table = 'utenti'
MongoClient.connect(uri_db)
    .then((client)=>{
        console.log('Connesione riuscita')
        const db = client.db(dbname)
        const collection =db.collection(table)
        x.forEach(element => {
            collection.insertOne({name:element.name,acronym:element.stock_exchange.acronym,country:element.stock_exchange.country,city:element.stock_exchange.city})
    });
    
    })










    /*const express = require('express')
const app = express()
const axios = require('axios')



app.use(express.static(__dirname+'/Public'))
const key = 'acfed0a614f9036ffec19a46ee2cd3e6'
let uri = `https://api.marketstack.com/v1/tickers?access_key=${key}`





app.get('/fetch',async (req,res)=>{
    const conn = await axios.get(uri)
    const x = conn.data.data
    
    const names = x.map((data)=>data.name)
    
    res.json({names})


})

app.listen(3000)*/
