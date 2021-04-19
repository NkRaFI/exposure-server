const express = require('express')
const port = 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jnkvp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const app = express()
app.use(bodyParser.json());
app.use(cors());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const servicesCollection = client.db("exposurePhotography").collection("services");
    const reviewCollection = client.db("exposurePhotography").collection("reviews");
    const orderCollection = client.db("exposurePhotography").collection("orders");
    const adminCollection = client.db("exposurePhotography").collection("admins");

    /*------------------All Service Api------------*/ 
    //get all services in the DB
    app.get('/services', (req, res) => {
        servicesCollection.find({})
        .toArray((err, services)=>{
            res.send(services)
        })
    })
    // get service by id
    app.get('/serviceById/:id',(req, res)=>{
        const id = req.params.id;
        servicesCollection.find({_id: ObjectId(id)})
        .toArray((err, services)=>{
            res.send(services[0]);
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
    //delete a service
    app.delete('/deleteService/:id', (req, res) => {
        servicesCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result =>{
            res.send(result.deletedCount > 0)
        })
    })


    /* ---------------All Review Api------------ */ 
    // post a review
    app.post('/addReview', (req, res)=> {
        const review = req.body;
        reviewCollection.insertOne(review)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })
    // get all reviews in the DB
    app.get('/reviews', (req, res)=>{
        reviewCollection.find({})
        .toArray((err, reviews)=>{
            res.send(reviews)
        })
    })


    /* ---------------All Order Api------------ */ 
    // add a order
    app.post('/addOrder', (req, res)=> {
        const review = req.body;
        orderCollection.insertOne(review)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })
    
    //get booking list of an user by email
    app.get('/bookingsByEmail', (req, res)=>{
        const email = req.query.email;
        orderCollection.find({email: email})
        .toArray((err, reviews)=>{
            res.send(reviews)
        })
    })

    // get all orders in the DB
    app.get('/orders', (req, res)=>{
        orderCollection.find({})
        .toArray((err, reviews)=>{
            res.send(reviews)
        })
    })
    // update order status
    app.patch('/updateStatus/:id', (req, res) => {
        orderCollection.updateOne(
          {_id: ObjectId(req.params.id)}, 
          {
              $set: {status: req.body.status}
          })
          .then(result => {
              res.send(result.matchedCount > 0);
          })
    })


    /*----------------------All Admins API-------------------*/
    // make an admins
    app.post('/makeAdmin', (req, res) => {
        const adminEmail = {email: req.body.email}
        adminCollection.insertOne(adminEmail)
        .then(result => {
            res.send(result.matchedCount > 0)
        })
    })

    // Checking Admin or Customer
    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, doctors) => {
                res.send(doctors.length > 0);
            })
    })

});
// mongodb end


/* ---------------Root Api------------ */ 
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port)