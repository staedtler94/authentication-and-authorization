const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(urlencodedParser);

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/login", function(req, res){
    res.send("success");
})

app.route("*", function (req, res) {
    res.redirect('/');
  });

app.listen(PORT);
console.log("Express started on port ", PORT);
