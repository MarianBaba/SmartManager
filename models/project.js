var mongoose = require('mongoose');

var projetSchema = new mongoose.Schema({
    name: String,
    start: String,
    end: String,
    company: String,
    department: String,
    state: String,
    employees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    ]
});

module.exports = mongoose.model('Project', projetSchema);