const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oyvr00h.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const vehicleCollection = client.db("job-task").collection("vehicles");


        app.post('/vehicles', async (req, res) => {
            const newVehicle = req.body;
            const result = await vehicleCollection.insertOne(newVehicle);
            res.send(result);
        })

        app.get('/vehicles', async (req, res) => {
            const result = await vehicleCollection.find().toArray();
            res.send(result)
        })

        app.get('/available-vehicles', async (req, res) => {
            const query = { checkout: '' };
            const availableVehicles = await vehicleCollection.find(query).toArray();
            res.send(availableVehicles);
        })

        app.put('/vehicle', async (req, res) => {
            const vehicle = req.query.vehicle;
            const query = { vehicleNumber: vehicle };
            const updatedObject = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: { checkout: updatedObject.checkout }
            };
            const result = await vehicleCollection.updateOne(query, updateDoc, options);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('This is homepage')
});



app.listen(port, () => {
    console.log('port is running')
})