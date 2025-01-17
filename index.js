// Step 1 - set up express & mongoose

var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
app.use('/public', express.static('public'))
var fs = require('fs');
var path = require('path');
require('dotenv/config');

// Step 2 - connect to the database
mongoose.connect('mongodb://localhost:27017/user_info'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
	console.log("connection succeeded"); 
})

// Step 3 - code was added to ./models.js

// Step 4 - set up EJS

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Set EJS as templating engine 
app.set("view engine", "ejs");


// Step 5 - set up multer for storing uploaded files

var multer = require('multer');

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	}
});

var upload = multer({ storage: storage });

// Step 6 - load the mongoose model for Image

var imgModel = require('./model');

// Step 7 - the GET request handler that provides the HTML UI

app.get('/', (req, res) => {
	imgModel.find({}, (err, items) => {
		if (err) {
			console.log(err);
			res.status(500).send('An error occurred', err);
		}
		else {
			res.render('viewQuizz', { items: items });
		}
	});
});

// Step 8 - the POST handler for processing the uploaded file

app.post('/', upload.single('image'), (req, res, next) => {

	var obj = {
		question: req.body.question,
		op1: req.body.op1,
		op2: req.body.op2,
		op3: req.body.op3,
		op4: req.body.op4
	}
	imgModel.create(obj, (err, item) => {
		if (err) {
			console.log(err);
		}
		else {
			// item.save();
			res.redirect('/');
		}
	});
});



// Step 9 - configure the server's port

var port = process.env.PORT || '3000'
app.listen(port, err => {
	if (err)
		throw err
	console.log('Server listening on port', port)
})
