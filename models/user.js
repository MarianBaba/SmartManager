var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    userEmail: { type: String, require: true, index: true, unique: true, sparse: true },
    password: String,
    userRole: String,
    companyName: String,
    companyEmail: String,
    companyAddress: String,
    company: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        }
    },
    employee: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    },
    department: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department'
        }
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
