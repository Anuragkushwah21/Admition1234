const express = require("express");
// console.log(express);
const app = express();
const port = 5000;
const web = require("./routes/web");
const connectDb = require("./db/connectdb");
const cookieParser=require('cookie-parser')
//file upload
const fileupload=require('express-fileupload')
const bodyParser = require("body-parser");

//file upload
app.use(fileupload({useTempFiles:true}))

//token get
app.use(cookieParser());

//connect db
connectDb();
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
//connect flash and session
const session = require('express-session')
const flash = require('connect-flash');
// const fileUpload = require("express-fileupload");

//message
app.use(session({
  secret: 'secret',
  cookie: { maxAge: 60000 },
  resave: flash,
  saveUninitialized: flash

}))
//flash message
app.use(flash())

//html css views
app.set("view engine", "ejs");

//html css link in file
app.use(express.static("public"));

//route load
app.use("/", web);

// server create
app.listen(port, () => {
  console.log("Server start locathost:5000");
});
