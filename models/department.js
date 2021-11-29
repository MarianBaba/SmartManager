var mongoose = require('mongoose');
var Project = require('./project');


var departmentSchema = new mongoose.Schema({
    departmentImage: String,
    departmentName: { type: String, require: true, index: true, sparse: true },
    departmentEmployees: String,
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        }
    ],
    createdBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Department', departmentSchema);