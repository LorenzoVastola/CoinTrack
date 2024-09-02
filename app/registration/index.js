

const { MongoClient } = require('mongodb')

const uriDB = 'mongodb://localhost:27017/'
const dbname = 'CoinTrack'
const table = 'Users'

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("C:/Users/Lorenzo/Desktop/CoinTrack/app/Public"));

    app.get('/Sign-Up',(req,res)=>{
        res.sendFile(__dirname+'/public/index.html');
    })
    app.get('/Sign-In',(req,res)=>{
        res.sendFile('c:/users/lorenzo/desktop/CoinTrack/app/Public/index.html');
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
                    app.use(express.static("C:/Users/Lorenzo/Desktop/CoinTrack/app/Public"))

                    res.sendFile('c:/users/lorenzo/desktop/CoinTrack/app/Public/index.html')

                } else {
                    console.log('DB Update')
                    collection.insertOne({Username:user[2],Email:user[0],Password:user[1]});
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
                   collection.findOne({Email:"lamianuovaemail@gmail.com"})
                   .then((response)=>{
                    res.send('Benvenuto: '+ response.Email);
                    console.log(response.Email)
                   })
                } else {
                    console.log('wrong')
                    res.sendFile(__dirname+'/public/404.html')
                }
        })
       })
    }) .catch((err)=>{console.log(err)})
    




