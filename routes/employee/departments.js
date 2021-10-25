const express = require('express');
const router = express.Router();
const Department = require('../../models/department');
const Employee = require('../../models/employee');
const Project = require('../../models/project');
var middleware = require('../../middleware');

//MOSTRA - MOSTRA INFORMAZIONI RIGUARDO UN SINGOLO DIPARTIMENTO
router.get('/homeemployee/departments/:id', middleware.isLoggedInAsEmployee, async (req, res) => {
    try {
        const foundEmployee = await Employee.findById(req.user.employee.id);
        const foundDepartment = await Department.findById(req.params.id);
        const allEmployees = await Employee.find({});
        const allProjects = await Project.find({});

        return res.render('employee/departments/show.ejs', {
            dept: foundDepartment,
            employee: foundEmployee,
            employees: allEmployees,
            projects: allProjects,
            currentUser: req.user
        });
    } catch (err) {
        res.status(404);
        return res.redirect('back');
    }
});

module.exports = router;