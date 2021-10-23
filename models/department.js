var mongoose = require('mongoose');
var Project = require('./project');
// definiamo lo schema dell'entità dipartimento per quando se ne dovrà salvare un'istanza nel database
var departmentSchema = new mongoose.Schema({
    departmentImage: String, //il tipo dell'informazione 'departmentImage' nel database è quello di stringa
    departmentName: { type: String, require: true, index: true, sparse: true }, //è una stringa ma ha delle opzioni specifiche
    departmentEmployees: String, //la lista dei dipendenti è una stringa
    projects: [ //l'array dei progetti è un array di oggetti, che hanno un ID
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        }
    ],
    createdBy: { //è contenuta l'informazione di chi ha creato un dipartimento nel database
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    createAt: { //è contenuta l'informazione di quando è stato creato un dipartimento nel database
        type: Date,
        default: Date.now
    }
});


departmentSchema.pre('remove', async function (next) { //fa in modo di eliminare tutti i progetti relativi a un dipartimento
    try {
        await Project.remove({
            _id: {
                $in: this.projects
            }
        });
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Department', departmentSchema);