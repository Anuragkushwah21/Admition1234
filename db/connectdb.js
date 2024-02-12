const mongoose = require("mongoose");
const Live_URL =
  "mongodb+srv://anuragkofficial21:<password>@cluster0.r3sc4oj.mongodb.net/?retryWrites=true&w=majority";
const Local_URL = "mongodb://0.0.0.0:27017/admission123";

const connectDb = () => {
  mongoose
    .connect(Local_URL)

    .then(() => {
      console.log("connected sucessfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDb;
