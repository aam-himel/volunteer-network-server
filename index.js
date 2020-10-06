const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const admin = require("firebase-admin");
const serviceAccount = require('./config/volunteer-network-34dd8-firebase-adminsdk-5fdgd-89a3f0ab8d.json');

app.use(bodyParser.json());
app.use(cors());

let PORT = 5000;

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server started at PORT ${process.env.PORT}`);
})
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL
});



//  Mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mycjj.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const eventCollection = client.db(`${process.env.DB}`).collection("eventDB");
  const userCollection = client.db(`${process.env.DB}`).collection("userDB");
  console.log('DB connected');
  // perform actions on the collection object
  app.post('/admin/addEvent', (req, res) => {
      console.log(req.body);
      eventCollection.insertOne(req.body)
        .then(response => {
            console.log("Item added.....",response);
        }) 
      res.send('I am working');
  })

  app.get('/events', (req, res) => {
    eventCollection.find({})
    .toArray((err, doc) => {
      res.send(doc);
      console.log(doc);
    })  
  })

  app.delete('/events/delete', (req, res) => {
    const id = req.query.id;
    eventCollection.deleteOne({
      _id: id
    })
    .then((err, doc) => {
      console.log("Deleted", doc);
    })
    console.log(id);

  })

  app.post('/user/register', (req, res) => {
    const data = req.body;
    userCollection.insertOne(data)
    .then(response => {
      console.log("Item added.....");
    })
    res.send('Eevnt Registerd successfully!')
  })

  app.get('/registeredEvents', (req, res) => {
    userCollection.find({})
    .toArray((err, doc) => {
      res.send(doc);
    })
  })

  app.get('/eventTasks', (req, res) => {
    const email = req.query.email;
    console.log(req.query.email)
    userCollection.find({
      email: email
    })
    .toArray((err, doc) => {
      res.send(doc);
    })
  })
  
});



// Api test
app.get('/', (req, res) => {
    res.send('Api is working perfectly!');
})