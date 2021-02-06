// Step 3 - this is the code for ./models.js

var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
	question: String,
	op1: String,
	op2: String,
	op3: String,
	op4: String
});

//Image is a model which has a schema imageSchema

module.exports = new mongoose.model('Image', imageSchema);
