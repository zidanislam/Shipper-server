

const express = require("express");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require("body-parser");
require('dotenv').config()
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

//midle ware
app.use(cors());
app.use(express.json());
// app.use(bodyParser.urlencoded({extended: true}));

//for database connected
const uri = `mongodb+srv://mongo-user:9JOfgYgBx5S3XGbM@cluster0.hpovn.mongodb.net/shipper?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  //try start
  try {
    await client.connect();
    console.log('succeffully')

    const database = client.db("shipper");
    const itemsCollection = database.collection("items");
    const orderCollection = database.collection("orders");



    //get itesms 
    app.get('/items', async (req, res) => {
      const cursor = itemsCollection.find({});
      const items = await cursor.toArray();
      res.json(items);
    })

    //post add order
    app.post('/addorder', async (req, res) => {
      const doc = req.body;
      const result = await orderCollection.insertOne(doc);
      res.send(result);
      console.log(result)
    })

    //get my order
    app.get('/myorder/:email', async (req, res) => {
      const result = await orderCollection.find({ email: req.params.email }).toArray();
      res.json(result)
    })

    //get all orders
    app.get('/allorders', async (req, res) => {
      const cursor = orderCollection.find({});
      const items = await cursor.toArray();
      res.json(items);

    })

    //delte order 
    app.delete('/deleteOrder/:id', async (req, res) => {
      // console.log(req.params);
      const result = await orderCollection.deleteOne({ _id: req.params.id });
      res.send(result.acknowledged)
    });

    //delete my order 
    app.delete('/deleteMyOrder/:id', async (req, res) => {
      // console.log(req.params.id);
      const result = await orderCollection.deleteOne({ _id: req.params.id });
      res.send(result.acknowledged)
    })

    //updet order status
    app.put('/updetOrder/:id', async (req, res) => {
      // console.log(req.params.id);
      const result = await orderCollection.updateOne({ _id: req.params.id },
        {
          $set: {
            status: "active"
          },

        }
      );
      res.send(result.acknowledged);
      console.log(result);
    })

    //updet my order statud
    app.put('/updetMyOrderStatus/:id', async (req, res) => {
      console.log(req.params.id);
      const result = await orderCollection.updateOne(
        { _id: req.params.id },
        {
          $set: {
            status: "active"
          }
        }
      );
      res.send(result.acknowledged);
    });

    //add a item
    app.post('/addaItem', async (req, res) => {
      console.log(req.body);
      const result = await itemsCollection.insertOne(req.body);
      console.log(result)
    })




  }
  //try end
  //finally start
  finally {
    // await client.close();

  }
  //finally end
}
//clled run function
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Server is online");
});

app.listen(port, () => {
  console.log('all right', port);
})


