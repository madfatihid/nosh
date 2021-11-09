var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/login', function (req, res) {
   res.sendFile( __dirname + "/" + "login.html" );
})

app.get('/register', function (req, res) {
   res.sendFile( __dirname + "/" + "register.html" );
})

app.post('/login', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   response = {
      email:req.body.email,
      password:req.body.password
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})