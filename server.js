require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || "4000";
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
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
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => console.log("connected"));

app.get("/", (req, res) => {
  console.log(res);
  res.send("Welcome");
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

app.set("port", port);

app.listen(port, () => {
  console.log(`App listening at ${port}`);
});
