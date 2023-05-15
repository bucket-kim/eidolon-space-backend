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
        "Congratulations, as a subscriber you are the first to join us on a journey to unlock a realm of boundless possibilities. With exclusive project launches and hidden identities, we invite you to explore a universe where art transcends the conventional, blurring the lines between reality and imagination. The road ahead may be shrouded in mystery, but we promise you an unforgettable experience of uncharted territories and unparalleled creativity. Get ready to witness the birth of something truly extraordinary.",
      outro: "Stay tuned for more updates.",
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
    await newEmail.save();
    res.status(201).send({ message: "Success" });
  } catch (err) {
    return res.status(409).send({ message: err.message });
  }

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(`Email sent: ${info.response}`);
      res.send("success");
    }
  });
});

app.use(errorController);

app.listen(port, () => {
  console.log(`App listening at ${port}`);
});
