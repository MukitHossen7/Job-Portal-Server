require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connection, client } = require("./DB/MongoDB");
const { ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
connection();

app.use(express.json());
app.use(cors());

const jobCollection = client.db("jobDB").collection("jobs");
const applyJobsCollection = client.db("jobDB").collection("applyJobs");

app.post("/jobs", async (req, res) => {
  const job = req.body;
  const result = await jobCollection.insertOne(job);
  res.send(result);
});
app.get("/jobs", async (req, res) => {
  const email = req.query.email;
  if (email) {
    const query = { hr_email: email };
    const jobs = await jobCollection.find(query).toArray();
    res.send(jobs);
  } else {
    const jobs = await jobCollection.find().sort({ _id: -1 }).toArray();
    res.send(jobs);
  }
});
app.get("/jobs/:id", async (req, res) => {
  const id = req.params.id;
  const params = { _id: new ObjectId(id) };
  const result = await jobCollection.findOne(params);
  res.send(result);
});
app.post("/apply_jobs", async (req, res) => {
  const applyData = req.body;
  const result = await applyJobsCollection.insertOne(applyData);
  res.send(result);
});
app.get("/apply_jobs", async (req, res) => {
  const email = req.query.email;
  const query = { candidate_email: email };
  const applyData = await applyJobsCollection.find(query).toArray();
  // const applyData = await applyJobsCollection.find().toArray();
  res.send(applyData);
});
app.get("/apply_jobs/job/:job_id", async (req, res) => {
  const jobId = req.params.job_id;
  const query = { job_id: jobId };
  const result = await applyJobsCollection.find(query).toArray();
  res.send(result);
});
app.get("/", (req, res) => {
  res.send("Welcome to job portal world");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
