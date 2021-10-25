const express = require('express');
const router = express.Router();
const Department = require('../../models/department');
const Employee = require('../../models/employee');
const Project = require('../../models/project');
var middleware = require('../../middleware');

//INDEX - MOSTRA TUTTI I PROGETTI
router.get('/homeadmin/projects', middleware.isLoggedInAsAdmin, function (req, res) {
    Project.find({ company: req.user.companyName }, function (err, allProjects) {
        if (err) {
            res.status(404);
            res.redirect('back');
        } else {
            res.render('admin/projects/index.ejs', { projects: allProjects, currentUser: req.user });
        }
    });
});

//NUOVO - MOSTRA IL FORM DI UN NUOVO PROGETTO
router.get('/homeadmin/projects/new', middleware.isLoggedInAsAdmin, function (req, res) {
    Department.find({}, function (err, allDepartments) {
        if (err) {
            res.status(404);
            res.redirect('back');
        } else {
            res.render('admin/projects/new.ejs', { departments: allDepartments, currentUser: req.user });
        }
    });
});

//CREA - CREA UN NUOVO PROGETTO
router.post('/homeadmin/projects', middleware.isLoggedInAsAdmin, function (req, res) {
    Department.findOne({ departmentName: req.body.project.department }, function (err, foundDepartment) {
        if (err) {
            res.status(404);
            res.redirect('back');
        } else {
            Project.create(req.body.project, function (err, project) {
                if (err) {
                    res.status(404);
                    res.redirect('back');
                } else {
                    project.save();
                    foundDepartment.projects.push(project);
                    foundDepartment.save();
                    res.redirect('/homeadmin/projects');
                }
            });
        }
    });
});

//MOSTRA - MOSTRA INFORMAZIONI RIGUARDO A UNO SPECIFICO PROGETTO
router.get('/homeadmin/projects/:id', middleware.isLoggedInAsAdmin, function (req, res) {
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
                    allEmployees.forEach(function (emp) {
                        foundProject.employees.push(emp);
                    });
                    res.render('admin/projects/show.ejs', {
                        project: foundProject,
                        employees: allEmployees,
                        currentUser: req.user
                    });
                }
            });
        }
    });
});

//MODIFICA - MOSTRA FORM DI MODIFICA DI UNO SPECIFICO PROGETTO
router.get('/homeadmin/projects/:id/edit', middleware.isLoggedInAsAdmin, function (req, res) {
    Project.findById(req.params.id, function (err, foundProject) {
        if (err) {
            res.status(404);
            res.redirect('back');
        } else {
            Department.find({}, function (err, allDepartments) {
                if (err) {
                    res.status(404);
                    res.redirect('back');
                } else {
                    res.render('admin/projects/edit.ejs', {
                        departments: allDepartments,
                        project: foundProject,
                        currentUser: req.user
                    });
                }
            });
        }
    });
});

//AGGIORNA - AGGIORNA UN PARTICOLARE PROGETTO
router.put('/homeadmin/projects/:id', middleware.isLoggedInAsAdmin, function (req, res) {
    Project.findByIdAndUpdate(req.params.id, req.body.project, function (err, updateProject) {
        if (err) {
            res.status(404);
            res.redirect('back');
        } else {
            res.redirect('/homeadmin/projects/' + req.params.id);
        }
    });
});

//CANCELLA - ELIMINA UN PARTICOLARE PROGETTO
router.delete('/homeadmin/projects/:id', middleware.isLoggedInAsAdmin, function (req, res) {
    Project.findByIdAndRemove(req.params.id, function (err, deletedProject) {
        if (err) {
            res.status(404);
            res.redirect('back');
        } else {
            res.redirect('/homeadmin/projects');
        }
    });
});

module.exports = router;