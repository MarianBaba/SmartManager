var mongoose = require('mongoose');

var companySchema = new mongoose.Schema({
	name: String,
	address: String,
	email: String,
});

module.exports = mongoose.model('Company', companySchema);
