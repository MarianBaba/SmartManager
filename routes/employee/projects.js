const express = require('express');
const router = express.Router();
const Employee = require('../../models/employee');
const Project = require('../../models/project');
var middleware = require('../../middleware');

var currentEmployee;

//INDEX - LISTA TUTTI I PROGETTI
router.get('/homeemployee/projects', middleware.isLoggedInAsEmployee, function (req, res) {
    Employee.findById(req.user.employee.id, function (err, foundEmployee) {
        if (err) {
            res.status(404);
            res.redirect('back');
            window.alert('errore: ' + err.message);
        } else {
            Project.find({ company: req.user.companyName }, function (err, allProjects) {
                if (err) {
                    res.status(404);
                    res.redirect('back');
                    window.alert('errore: ' + err.message);
                } else {
                    currentEmployee = foundEmployee;
                    res.render('employee/projects/index.ejs', {
                        projects: allProjects,
                        employee: foundEmployee,
                        currentUser: req.user
                    });
                }
            });
        }
    });
});

//MOSTRA - MOSTRA INFORMAZIONI RIGUARDO UNO SPECIFICO PROGETTO
router.get('/homeemployee/projects/:id', middleware.isLoggedInAsEmployee, function (req, res) {
    Project.findById(req.params.id, function (err, foundProject) {
        if (err) {
            res.status(404);
            res.redirect('back');
        } else {
            Employee.find({}, function (err, allEmployees) {
                if (err) {
                    res.status(404);
                    res.redirect('back');
                } else {
                    res.render('employee/projects/show.ejs', {
                        project: foundProject,
                        employees: allEmployees,
                        employee: currentEmployee,
                        currentUser: req.user
                    });
                }
            });
        }
    });
});

module.exports = router;