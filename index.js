const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5q2pzru.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// ===========================================
// DB
// ===========================================

const db = client.db(process.env.DB_USER);

// ===========================================
// Mongo Connect
// ===========================================

async function run() {
  try {
    await client.connect();

    console.log("MongoDB Connected");

    // ===========================================
    // Routes
    // ===========================================
    // test route
    app.get("/test", (req, res) => {
      res.send("Server Running");
    });
  } catch (error) {
    console.log(error);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
