let mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/PRG06', { useNewUrlParser: true, useUnifiedTopology : true, useFindAndModify : false});//PRG06

console.log('starting: my webservice')

//koppel package aan de web server
const express = require('express');

//maak beschikbaar via de app
const app = express();

const bodyParser = require('body-parser');

//wordt altijd aangeroepen
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

//voeg entry toe voor de url/
app.get('/', function(req, res) {
    console.log("End point /")
    res.header("Content-Type", "application/json")
    res.send( "{ \"message\": \"Hello World!\" }");
});

let carsRouter = require('./routes/carsRoutes')();
 
app.use('/api', carsRouter);

//start web app
app.listen(8000);