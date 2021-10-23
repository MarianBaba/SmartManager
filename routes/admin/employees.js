const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Department = require('../../models/department');
const Employee = require('../../models/employee');
var middleware = require('../../middleware');

//INDEX - MOSTRA TUTTI I DIPENDENTI
router.get('/homeadmin/employees', middleware.isLoggedInAsAdmin, function (req, res) {
    Employee.find({}, function (err, allEmployees) {
        if (err) {
            res.status(404);
            res.redirect('/homeadmin');
            window.alert('errore: ' + err.message);
        } else {
            res.render('admin/employees/index.ejs', { employees: allEmployees, currentUser: req.user });
        }
    });
});

//NUOVO - MOSTRA IL FORM PER LA CREAZIONE DI UN NUOVO DIPENDENTE
router.get('/homeadmin/employees/new', middleware.isLoggedInAsAdmin, function (req, res) {
    Department.find({}, function (err, allDepartment) {
        if (err) {
            res.status(404);
            res.redirect('back');
            window.alert('errore: ' + err.message);
        } else {
            res.render('admin/employees/new.ejs', { departments: allDepartment, currentUser: req.user });
        }
    });
});

//CREAZIONE - CREA UN NUOVO DIPENDENTE
router.post('/homeadmin/employees', middleware.isLoggedInAsAdmin, function (req, res) {
    let empl = {
        firstName: req.body.employee.firstName,
        lastName: req.body.employee.lastName,
        dateOfBith: req.body.employee.dateOfBith,
        gender: req.body.employee.gender,
        password: req.body.employee.password,
        photo: req.body.employee.photo,
        email: req.body.employee.email,
        mobile: req.body.employee.mobile,
        company: req.body.employee.company,
        employeeId: req.body.employee.employeeId,
        designation: req.body.employee.designation,
        joiningDate: req.body.employee.joiningDate,
        department: req.body.employee.department
    };
    Employee.create(req.body.employee, function (err, newlyCreated) {
        if (err) {
            res.status(404);
            res.redirect('back');
            console.log('errore dopo employee create: ' + err.message);
        } else {
            var pwd = newlyCreated.password;
            Employee.findByIdAndUpdate(newlyCreated._id, pwd, function (err, emp) {
                if (err) {
                    res.status(404);
                    res.redirect('back');
                    console.log('errore dopo employee find by id and up');
                } else {
                    Department.findOne({ departmentName: emp.department }, function (err, foundDepartment) {
                        if (err) {
                            res.status(404);
                            res.redirect('back');
                            console.log('errore dopo department find one');
                        } else {
                            var newUser = new User({
                                username: newlyCreated.employeeId,
                                userEmail: newlyCreated.email,
                                userRole: newlyCreated.designation,
                                companyName: newlyCreated.company,
                                company: {
                                    id: req.user.company.id
                                },
                                employee: {
                                    id: emp.id
                                },
                                department: {
                                    id: foundDepartment.id
                                }
                            });
                            User.register(newUser, pwd, function (err, user) {
                                if (err) {
                                    res.status(404);
                                    console.log('errore dopo user-register: ' + err.message);
                                    return res.redirect('back');
                                }
                                res.redirect('/homeadmin/employees');
                            });
                        }
                    });
                }
            });
        }
    });
});

//MOSTRA - MOSTRA INFORMAZIONI RISPETTO A UNO SPECIFICO DIPENDENTE
router.get('/homeadmin/employees/:id', middleware.isLoggedInAsAdmin, function (req, res) {
    Employee.findById(req.params.id, function (err, foundEmployee) {
        if (err) {
            res.status(404);
            res.redirect('back');
            console.log('errore: ' + err.message);
        } else {
            res.render('admin/employees/show', { emp: foundEmployee, currentUser: req.user })
        }
    });
});

//MODIFICA - MOSTRA IL FORM DI MODIFICA DI UN DIPENDENTE
router.get('/homeadmin/employees/:id/edit', middleware.isLoggedInAsAdmin, function (req, res) {
    Employee.findById(req.params.id, function (err, foundEmployee) {
        if (err || !foundEmployee) {
            res.status(404);
            res.redirect('back');
            console.log('errore: ' + err.message);
        } else {
            Department.find({}, function (err, alLDepartments) {
                if (err) {
                    res.status(404);
                    res.redirect('back');
                    alert('errore: ' + err.message);
                } else {
                    res.render('admin/employees/edit', {
                        emp: foundEmployee,
                        departments: alLDepartments,
                        currentUser: req.user
                    });
                }
            });
        }
    });
});

//UPADATE - MODIFICA EFFETTIVAMENTE LE INFORMAZIONI DI UN DIPENDENTE
router.put('/homeadmin/employees/:id', middleware.isLoggedInAsAdmin, async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body.employee);

        let usr = {
            username: req.body.employee.employeeId
        };

        const updateUser = await User.findOneAndUpdate({ 'employee.id': updatedEmployee.id }, usr);

        const foundUser = await User.findOne({ username: req.body.employee.employeeId });
        const foundDepartment = await Department.findOne({ departmentName: req.body.employee.department });

        foundUser.department.id = foundDepartment.id;
        await foundUser.save();

        await User.findOneAndRemove({ 'employee.id': updatedEmployee.id });

        var pwd = req.body.employee.password;
        var pwdUpdate = { password: pwd };

        var newUser = new User({
            username: req.body.employee.employeeId,
            userEmail: req.body.employee.email,
            userRole: req.body.employee.designation,
            companyName: req.body.employee.company,
            company: {
                id: req.user.company.id
            },
            employee: {
                id: updatedEmployee.id
            },
            department: {
                id: foundDepartment.id
            }
        });

        const user = await User.register(newUser, pwd);

        res.redirect('/homeadmin/employees/' + req.params.id);

    } catch (err) {
        res.status(404);
        res.redirect('back');
        console.log('errore: ' + err.message);
    }
});

//ELIMINA - ELIMINA UN PARTICOLARE DIPENDENTE
router.delete('/homeadmin/employees/:id', middleware.isLoggedInAsAdmin, function (req, res) {
    Employee.findByIdAndRemove(req.params.id, function (err, deletedEmployee) {
        if (err) {
            res.status(404);
            res.redirect('back');
            console.log('errore: ' + err.message);
        } else {
            User.findOneAndRemove({ username: deletedEmployee.employeeId }, function (err, removed) {
                if (err) {
                    res.status(404);
                    console.log('errore: ' + err.message);
                } else {
                    res.redirect('/homeadmin/employees');
                }
            });
        }
    });
});

module.exports = router;