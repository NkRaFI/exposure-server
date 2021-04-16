const express = require('express')
const port = 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jnkvp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
app.use(bodyParser.json());
app.use(cors());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const servicesCollection = client.db("exposurePhotography").collection("services");

    //get all services
    app.get('/services', (req, res) => {
        servicesCollection.find({})
        .toArray((err, services)=>{
            res.send(services)
        })
    })


    // post a service
    app.post('/addService', (req, res) => {
        const service = req.body;
        servicesCollection.insertOne(service)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

});
// mongodb end



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port)