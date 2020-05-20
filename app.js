//jshint esversion:6
require('dotenv').config(); //for API-key and secret
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true})
//for encryption
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = process.env.API_KEY;
//extends the capability, to encrypt password field only
//it will automatically encrypt when saving and decrypt when finding or reading.
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("home");//renders home page
});

app.get("/login", function(req, res){
  res.render("login");//renders login page
});

app.get("/register", function(req, res){
  res.render("register");//renders register page
});

app.get("/logout", function(req, res){
  res.render("home");//renders home page
});

app.get("/submit", function(req, res){
  res.render("submit");//renders home page
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err){
      console.log(err);
    }else {
      res.render("secrets");//renders secrets page
    }
  })
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser){
        if (foundUser.password === password) {
          res.render("secrets"); //renders secrets page
        }
      }
    }
  })
});

app.post("/submit", function(req, res){
  const submittedSecret = req.body.secret;
  //once the user is authenticated and their session gets saved,
  //their user details are saved to req.userDB
//  console.log(req.user.id);
/*  User.findById(req.user.id, function(err, foundUser){
  if (err) {
    console.log(err);
  } else {
    if (foundUser) {
      foundUser.secret = submittedSecret;
      foundUser.save(function(){
        res.redirect("/secrets");
      });
    }
  }
});*/

});

//go to brower and type localhost:3000
app.listen(3000, function(){
  console.log("server started on port 3000")
});
