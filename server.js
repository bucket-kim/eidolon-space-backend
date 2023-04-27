require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || "4000";
const mongoose = require("mongoose");
const Email = require("./models/email");
const errorController = require("./errorController");

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.json());

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
  .connect(`${process.env.DB_LINK}`)
  .then(() => console.log("connected"))
  .catch((err) => console.log(err.message));

app.get("/", (req, res) => {
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
    res.status(409).send(err.message);
  }
});

app.use(errorController);

app.listen(port, () => {
  console.log(`App listening at ${port}`);
});
