const http = require('http');
const express = require("express");
const bodyParser = require('body-parser');
require('dotenv').config()
const app = express();
const PORT = process.env.PORT || 5000;
require('./src/config/db');

app.use(express.static('Public'));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    );
	next();
});

const urlRoute = require('./src/routes/urlgenerator.routes')
const UrlgeneratorController = require('./src/controllers/urlgenerator.controller')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res)=>{
    console.log("API Working");
    res.sendStatus(200)
});

app.get('/:url?', UrlgeneratorController.urlRedirect);
app.use('/url', urlRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    return res.sendStatus(404);
});

var httpServer = http.createServer(app);
httpServer.listen(PORT, () =>
{
  console.log(`Server started on port`, PORT)
});
module.exports = app;