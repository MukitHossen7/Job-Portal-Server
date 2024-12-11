require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connection, client } = require("./DB/MongoDB");
const app = express();
const port = process.env.PORT || 5000;
connection();

app.use(express.json());
app.use(cors());

const jobCollection = client.db("jobDB").collection("jobs");

app.post("/jobs", async (req, res) => {
  const job = req.body;
  const result = await jobCollection.insertOne(job);
  res.send(result);
});
app.get("/", (req, res) => {
  res.send("Welcome to job portal world");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
