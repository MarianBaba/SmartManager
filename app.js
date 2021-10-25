const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const app = express();
const server = http.createServer(app);

//da qui in giù, serve tutto per la connessione a mongoDB CONNESSIONE AD DATABASE
const dotenv = require('dotenv').config();

app.set('view engine', 'ejs'); //senza questo è necessario scrivere l'estensione dei file quando si fa res.render, io lo faccio per scrupolo
app.use(express.static(__dirname + '/public')); //per caricare correttamente i file css
app.use(methodOverride('_method')); //Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.

const DBURI = process.env.ATLAS_URI;

mongoose.connect(DBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useFindAndModify: false,
});

const conn = mongoose.connection;

conn.once('open', () => {
    console.log('connessione avvenuta a mongoose');
});

//senza questo non riesce a leggere quello che c'è nei form, serve perché i riferimenti req.body.funzionino effettivamente
app.use(express.urlencoded({ extended: true }));

//PASSPORT
app.use(
    require('express-session')({
        secret: 'Smart Manager',
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//configurazione delle route, prima importate, poi assegnate a una costante e infine utilizzate dall'app, ovvero dal server
const indexRoutes = require('./routes/index');
const adAdminRoutes = require('./routes/admin/admin');
const adDepartmentsRoutes = require('./routes/admin/departments');
const adEmployeesRoutes = require('./routes/admin/employees');
const adProjectsRoutes = require('./routes/admin/projects');
const emDepartmentsRoutes = require('./routes/employee/departments');
const emEmployeeRoutes = require('./routes/employee/employee');
const emProjectsRoutes = require('./routes/employee/projects');

app.use(indexRoutes);
app.use(adAdminRoutes);
app.use(adDepartmentsRoutes);
app.use(adEmployeesRoutes);
app.use(adProjectsRoutes);
app.use(emDepartmentsRoutes);
app.use(emEmployeeRoutes);
app.use(emProjectsRoutes);

//connessione a una porta in locale per il funzionamento dell'applicazione
const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
    console.log('Smart Manager server è in attesa di richieste...');
});