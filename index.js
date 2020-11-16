const express = require("express");
const bodyParser = require('body-parser');
const process = require('process');
const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(urlencodedParser);

const db = require("./components/db-helper");
db.setup();

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/new-users", function (req, res) {
  res.sendFile("public/signUp.html", {root: __dirname });
});

app.post("/login", function(req, res){
  db.userCreds(req.body.userName, req.body.password).then((val)=>{
    res.cookie("token","success").sendFile("public/home.html", {root: __dirname });
  }).catch((err)=>{
    // handle errors
    res.sendFile("public/error-index.html", {root: __dirname });
  })
})

app.post("/new-users", function(req, res){

  db.insertUsers(req.body.userName, req.body.password).then((val)=>{

    res.cookie("token","success").sendFile("public/home.html", {root: __dirname });
  }).catch((err)=>{

    if(err.message.includes("UNIQUE") && err.message.includes("userName")){
      res.cookie("error", "Username Taken");
    }
    res.sendFile("public/error-signup.html", {root: __dirname });
  })
})

app.get("*", function (req, res) {
    res.redirect('/');
  });

var server = app.listen(PORT);
console.log("Express started on port ", PORT);

process.on('SIGINT', (code) => {
  console.info('...');
  console.info('EXIT signal received.');
  console.log('Closing server.');

  server.close((err)=>{
    if(err){
      console.error("Error in closing the server");
    }
    db.close();
  })
});