const express = require('express');
const router = express.Router();
const Department = require('../../models/department');
const Employee = require('../../models/employee');
const Project = require('../../models/project');
var middleware = require('../../middleware');

//INDEX - LISTA DI TUTTI I DIPARTIMENTI
router.get('/homeadmin/departments', middleware.isLoggedInAsAdmin, async (req, res) => {
    try {
        const allDepartments = await Department.find({});
        res.render('admin/departments/index.ejs', { departments: allDepartments, currentUser: req.user });
    } catch (err) {
        res.status(404);
        return res.redirect('back');
    }
});

//NUOVO - MOSTRA IL FORM PER UN NUOVO DIPARTIMENTO
router.get('/homeadmin/departments/new', middleware.isLoggedInAsAdmin, function (req, res) {
    res.render('admin/departments/new.ejs', { currentUser: req.user });
});

//CREA - CREA UN NUOVO DIPARTIMENTO
router.post('/homeadmin/departments', middleware.isLoggedInAsAdmin, function (req, res) {
    const name = req.body.departmentName;
    const image = req.body.departmentImage;
    const createdBy = {
        id: req.user.id,
        username: req.user.username
    };

    const newDepartment = {
        departmentImage: image,
        departmentName: name,
        company: req.user.companyName,
        createdBy
    };

    Department.create(newDepartment, function (err, newlyCreated) {
        if (err) {
            res.status(404);
            res.redirect('back');
            console.log('errore');
        } else {
            res.status(200);
            res.redirect('/homeadmin');
            console.log('Dipartimento creato con successo');
        }
    });
});

//MOSTRA - MOSTRA INFORMAZIONI SU UNO SPECIFICO DIPARTIMENTO
router.get('/homeadmin/departments/:id', middleware.isLoggedInAsAdmin, function (req, res) {
    Department.findById(req.params.id).populate('projects').exec(function (err, foundDepartment) {
        if (err || !foundDepartment) {
            res.status(404);
            res.redirect('back');
            console.log('errore: ' + err.message);
        } else {
            Employee.find({}, function (err, allEmployees) {
                if (err) {
                    res.status(404);
                    res.redirect('back');
                    console.log('errore: ' + err.message);
                } else {
                    Project.find({}, function (err, allProjects) {
                        if (err) {
                            res.status(404);
                            res.redirect('back');
                            console.log('errore: ' + err.message);
                        } else {
                            res.render('admin/departments/show.ejs', {
                                department: foundDepartment,
                                employees: allEmployees,
                                projects: allProjects,
                                currentUser: req.user
                            });
                        }
                    });
                }
            });
        }
    });
});

//EDIT - MOSTRA IL FORM DI MODIFICA PER UN DIPARTIMENTO
router.get('/homeadmin/departments/:id/edit', middleware.isLoggedInAsAdmin, function (req, res) {
    Department.findById(req.params.id, function (err, foundDepartment) {
        if (err || !foundDepartment) {
            res.status(404);
            res.redirect('back');
            console.log('errore: Dipartimento non trovato');
        } else {
            res.render('admin/departments/edit.ejs', { department: foundDepartment, currentUser: req.user })
        }
    });
});

//UPDATE - AGGIORNA UN PARTICOLARE DIPARTIMENTO
router.put('/homeadmin/departments/:id', middleware.isLoggedInAsAdmin, async (req, res) => {
    try {
        var createdBy = {
            id: req.user.id,
            username: req.user.username
        };
        let departmentUpd = {
            departmentName: req.body.department.departmentName,
            departmentCategory: req.body.department.departmentCategory,
            departmentImage: req.body.department.departmentImage,
            departmentDescription: req.body.department.departmentDescription,
            company: req.user.companyName,
            createdBy
        };

        const updatedDepartment = await Department.findByIdAndUpdate(req.params.id, departmentUpd);
        const foundDepartment = await Department.findById(req.params.id);
        const allEmployees = await Employee.find({});
        const allProjects = await Project.find({});

        //AGGIORNA IL NOME DEL DIPARTIMENTO PER OGNI DIPENDENTE APPARTENENTE A TALE DIPARTIMENTO
        allEmployees.forEach(async function (employee) {
            if (
                employee.company === req.user.companyName &&
                employee.department === updatedDepartment.departmentName
            ) {
                let emp = {
                    department: foundDepartment.departmentName
                };
                const updatedEmployee = await Employee.findByIdAndUpdate(employee.id, emp);
            }
        });
        //AGGIORNA IL NOME DEL DIPARTIMENTO PER OGNI PROGETTO APPARTENENTE AL DIPARTIMENTO
        allProjects.forEach(async function (project) {
            if (project.company === req.user.companyName && project.department === updatedDepartment.departmentName) {
                let prjct = {
                    department: foundDepartment.departmentName
                };
                const updatedProject = await Project.findByIdAndUpdate(project.id, prjct);
            }
        });
        res.status(200);
        console.log('Dipartimento modificato con successo');
        return res.redirect('/homeadmin/departments/' + req.params.id);
    } catch (err) {
        res.status(404);
        console.log('errore, impossibile aggiornare informazioni dipartimento');
        return res.redirect('back');
    }
});

//ELIMINA - CANCELLA UN PARTICOLARE DIPARTIMENTO
router.delete('/homeadmin/departments/:id', middleware.isLoggedInAsAdmin, function (req, res) {
    Department.findById(req.params.id, function (err, department) {
        if (err) {
            res.status(404);
            console.log('errore: ' + err.message);
            res.redirect('back');
        } else {
            console.log(req.params.id);
            department.deleteOne();
            res.status(200);
            console.log('Dipartimento eliminato con successo');
            res.redirect('/homeadmin');
        }
    });
});

/* router.delete('/homeadmin/departments/:id', middleware.isLoggedInAsAdmin, function(req, res) {
    Department.findById(req.params.id, function(err, department) {
        if (err) {
            req.flash('error', err.message);
            res.redirect('back');
        } else {
            department.remove();
            req.flash('success', 'Dipartimento eliminato con successo');
            res.redirect('/homeadmin');
        }
    });
}); */

module.exports = router;