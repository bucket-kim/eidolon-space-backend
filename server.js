require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || "4000";
const mongoose = require("mongoose");
const Email = require("./models/email");
const errorController = require("./errorController");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

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
    return res.status(409).send({ message: err.message });
  }
});

app.post("/email", async (req, res) => {
  const { email } = req.body;

  const config = {
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS,
    },
  };

  const transporter = nodemailer.createTransport(config);

  const MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js/",
    },
  });

  const response = {
    body: {
      intro:
        "We welcome you to Eidolon Space. We will update our latest feeds and cool stuff as soon as possible. ",
      outro: "Stay tuned for more updates!",
    },
  };

  const mail = MailGenerator.generate(response);

  const message = {
    from: process.env.USER,
    to: email,
    subject: "Eidolon Space Subscription",
    html: mail,
  };

  try {
    transporter.sendMail(message);
    return res.status(201).json({
      msg: "you should receieve an email",
    });
  } catch (err) {
    return res.status(500).json({ err });
  }
});

app.use(errorController);

app.listen(port, () => {
  console.log(`App listening at ${port}`);
});
