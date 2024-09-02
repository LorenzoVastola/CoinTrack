const express = require('express')
const app = express()
const axios = require('axios')
const path = require('path')



const key = '6a91f461-6231-490e-be62-0f35c9e3e7ea';
const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';


const optionsReq = {
    headers: {
        'X-CMC_PRO_API_KEY': key,
    },
    params: {
        'start': '1',
        'limit': '100', 
        'convert': 'USD' 
    }
};



/* Session */

const session = require('express-session')

app.use(session({secret:"papoiu"}))
app.use((req, res, next) => {
    if (!req.session.username && req.path === '/') {
        console.log('Sessione non valida, reindirizzamento alla pagina di accesso');
        return res.sendFile(path.join(__dirname, 'Public/signin.html'));
    }
    next(); 
});

app.use(express.static(path.join(__dirname, 'Public')));


/* Login System */
const { MongoClient } = require('mongodb')


const uriDB = 'mongodb://localhost:27017/'
const dbname = 'CoinTrack'
const table = 'Users'

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended:true}))


    app.get('/Sign-Up',(req,res)=>{
        res.sendFile(__dirname+'/Public/signup.html');
    })
    app.get('/Sign-In',(req,res)=>{
        res.sendFile(__dirname+'/Public/signin.html');
    })

    MongoClient.connect(uriDB)
    .then((client)=>{
        console.log('Connesione riuscita')
        const db = client.db(dbname)
        const collection =db.collection(table)

        app.post('/Sign-up-logged',(req,res)=>{

                let user = [req.body.Email,req.body.Password,req.body.Username]
            
            collection.findOne({$or: [{Email:user[0]},{Password:user[1]}]})
            .then((foundUser) => {
                if(foundUser){
                    console.log(foundUser)
                    res.sendFile(__dirname+'/Public/404.html')

                } else {
                    console.log('DB Update')
                    collection.insertOne({Username:user[2],Email:user[0],Password:user[1]});
                    req.session.username = user[0]
                    console.log(req.session.username)
                    res.sendFile(__dirname+'/Public/index.html')
                    }
            }
            )

            })
        app.post('/Sign-in-logged',(req,res)=>{
            let user = [req.body.Email,req.body.Password]
            console.log(user)
            collection.findOne({$and: [{Email:user[0]},{Password:user[1]}]})
            .then((foundUser) => {
                if(foundUser){
                    console.log('Correct ')
                    req.session.username = user[0]
                    console.log(req.session.username)
                    res.sendFile(__dirname+'/Public/index.html')

                    
                 
                } else {
                    console.log('wrong')
                    res.sendFile(__dirname+'/Public/404.html')
                }
        })
       })

       app.get('/myprofile',(req,res)=>{
       /* Validation session check */
        if(req.session.username){
            /* Taking data of user and sending to profile.js */
            collection.findOne({Email:req.session.username})
            .then((response)=>{
                let userData = {
                "Username":response.Username,
                "Email":response.Email,
                "Password":response.Password
            }
                console.log(userData)
                res.json(userData)
            }).finally(() => response.close())

            } else{
                res.sendFile(path.join(__dirname,'Public/signin.html'))
            }

        
    })

    }) .catch((err)=>{console.log(err)})

app.get('/dashboard',(req,res)=>{
  if(!req.session.username){
      console.log(path.join(__dirname,'Public/signin.html'))
      console.log('entrato')
      return res.sendFile(path.join(__dirname,'Public/signin.html'))
   
  } 
  axios.get(url,optionsReq)
  .then((response)=>{
      let x = response.data.data
      let y = []
      x.forEach(element => {
          element.imageUrl = `https://s2.coinmarketcap.com/static/img/coins/64x64/${element.id}.png`;
            y.push({name:element.name,
              symbol:element.symbol,
              imageUrl:element.imageUrl,
              price:element.quote.USD.price,
              v24:element.quote.USD.volume_24h,
              markcap:element.quote.USD.market_cap,
              c1:element.quote.USD.percent_change_1h,
              c24:element.quote.USD.percent_change_24h,
              c7d:element.quote.USD.percent_change_7d,      
            })
})
      res.json(y)
}).catch((err)=>console.log(err))
  

})

// Middleware per parsare il JSON nel corpo delle richieste
app.use(express.json());

app.post('/saved-element',(req,res)=>{
    let savedElement = req.body.Name
    console.log(req.session.username)
    res.json({"Data":savedElement})
    MongoClient.connect(uriDB)
    .then((response)=>{
        const table = 'Users'
        const dbname = 'CoinTrack'
        const dbSaved = response.db(dbname)
        const collection =dbSaved.collection(table)
        console.log('insr')
        console.log(savedElement)
        collection.updateOne({Email:req.session.username},
            {$push:{Saved:savedElement}},
            {upsert:true}
    ).finally(() => response.close())
    })
})

app.get('/saved',(req,res)=>{
   
   if(req.session.username){
    let user = req.session.username
    
    MongoClient.connect(uriDB)
    .then((response)=>{
        const table = 'Users'
        const db = 'CoinTrack'

        dbName = response.db(db)
        connection = dbName.collection(table)

        return connection.findOne({Email:req.session.username})
    })
    .then((response)=>{
        let saveData = response.Saved
        console.log(saveData)
        res.json({"Saved":saveData})
    })
   }else{
    return res.sendFile(path.join(__dirname,'Public/signin.html'))

   }
 
})

app.get('/saved-page',(req,res)=>{
  if(req.session.username){
    axios.get(url,optionsReq)
    .then((response)=>{
        let x = response.data.data
        let y = []
        x.forEach(element => {
            element.imageUrl = `https://s2.coinmarketcap.com/static/img/coins/64x64/${element.id}.png`;
              y.push({name:element.name,
                symbol:element.symbol,
                imageUrl:element.imageUrl,
                price:element.quote.USD.price,
                v24:element.quote.USD.volume_24h,
                markcap:element.quote.USD.market_cap,
                c1:element.quote.USD.percent_change_1h,
                c24:element.quote.USD.percent_change_24h,
                c7d:element.quote.USD.percent_change_7d,      
              })
      res.sendFile(path.join(__dirname,'Public/saved.html'))
  
  })
        res.json(y)
  }).catch((err)=>console.log(err))
      
  } else{
    return res.sendFile(path.join(__dirname,'Public/signin.html'))
  }
})
   
    






app.listen(3000)

