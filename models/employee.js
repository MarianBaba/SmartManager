var mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    dateOfBirth: String,
    gender: String,
    password: String,
    photo: String,

    mobile: String,
    email: { type: String, require: true, index: true, unique: true, sparse: true },

    employeeId: { type: String, require: true, index: true, unique: true, sparse: true },
    company: String,
    designation: String,
    joiningDate: String,
    department: String,
})

module.exports = mongoose.model('Employee', employeeSchema);