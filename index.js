const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json());
const port = process.env.PORT || 8000;
// 1Op5fQENtk0uKTpM
// basic-express-crud

const products = [
    {
        id: 1,
        name: "Wireless Noise-Canceling Headphones",
        price: 189.99
    },
    {
        id: 2,
        name: "Ergonomic Mechanical Keyboard",
        price: 124.50
    },
    {
        id: 3,
        name: "Ultra-Wide Gaming Monitor",
        price: 349.99
    }
];

// app.get('/products', (req, res) => {
//     res.send(products)
// })

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function server() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        const db = client.db("e-commerce");
        const productCollection = db.collection("products");

 // ******************** Read Operation is here :
        app.get("/products", async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


// ******************** Read by ID Operation is here :
        app.get("/products/:productId", async (req, res) => {
            const productId = req.params.productId;
            const query = { _id: new ObjectId(productId) };
            console.log(query);
            const result = await productCollection.findOne(query);
            res.send(result);
        })


// ******************** Create Operation is here :
        app.post("/products", async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });



// ******************** Update Operation is here :
        app.patch("/products/:productId", async (req, res) => {
            const { productId } = req.params;
            const updateData = req.body;
            const filter = { _id: new ObjectId(productId) };
            const updateDoc = {
                $set: {
                    ...updateData,
                }
            };
            const result = await productCollection.updateOne(filter, updateDoc);
            res.send(result);
        });



// ******************** Delete Operation is here :
        app.delete("/products/:productId", async (req, res) => {
            const productId = req.params.productId;
            const query = { _id: new ObjectId(productId) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
server().catch(console.dir);

// Sever home page is here:
app.get('/', (req, res) => {
    res.send('Basic server is created for the project .')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
