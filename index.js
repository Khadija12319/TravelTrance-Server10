const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config();
const port= process.env.PORT  || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());



//const uri = "mongodb+srv://<username>:<password>@cluster0.wy4ghoc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wy4ghoc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const spotsdata=client.db('assignment-10').collection('spots');
    const countrydata=client.db('assignment-10').collection('countries');

    app.post('/spots', async(req,res)=>{
        const newSpot=req.body;
        const result = await spotsdata.insertOne(newSpot);
        res.send(result); 
    })

    app.get('/spots', async(req,res) =>{
        const cursor=spotsdata.find();
        const spots = await cursor.toArray();
        res.send(spots);
    })

    app.get('/country',async(req,res) =>{
        const cursor=countrydata.find();
        const country= await cursor.toArray();
        res.send(country);
    })

    app.get('/spots/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)};
        const spot=await spotsdata.findOne(query);
        res.send(spot);

    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);


app.get("/",(req,res) =>{
    res.send("Server is running");
})

app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`);
})