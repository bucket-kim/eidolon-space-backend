// const bodyParser = require("body-parser");
// const MongoClient = require("mongodb").MongoClient;
// const newRouter = require("./router.js");

// const express = require("express");
// const app = express();

// const cors = require("cors");
// app.use(cors());

// app.use(bodyParser.json());

// MongoClient.connect("mongodb://localhost:27017") // This is the location of where your local database is living.
//   .then((client) => {
//     const db = client.db("email_db"); // The name we gave our DB
//     const staffCollection = db.collection("email"); // The name we gave our collection inside the DB
//     const emailRouter = newRouter(staffCollection); // We haven't built the router functionality yet, but we will next!

//     app.use("/api/email", emailRouter); // Defining the base route where we can later access our data
//   })
//   .catch(console.err);

// app.listen(4000, function () {
//   console.log(`Listening on this port: ${this.address().port}`);
// });

// mongodb+srv://bkim07:<password>@cluster0.pkfjf7i.mongodb.net/test
// mongodb+srv://bkim07:<password>@cluster0.pkfjf7i.mongodb.net/test

require("dotenv").config();
const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const mongoose = require("mongoose");
const Email = require("./models/email");
const errorController = require("./errorController");

app.use(express.json());
app.use(cors());

const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

if (day < 10) {
  day = "0" + day;
}

if (month < 10) {
  month = "0" + month;
}

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pkfjf7i.mongodb.net/eidolon-subscription-email`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("connected"));

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.post("/login", (req, res) => {
  console.log(req.body);

  res.send("valid");
});

app.post("/email", async (req, res) => {
  const { email } = req.body;
  const newEmail = new Email({
    email,
    date: `${year}/${month}/${day}`,
  });
  try {
    await newEmail.save();
    res.status(201).send({ message: "Success" });
  } catch (err) {
    res.status(400).send(err.message);
    res.status(409).send(err.message);
  }
});

app.use(errorController);

app.listen(process.env.PORT || 4000, () => {
  console.log(`App listening at ${port}`);
});
