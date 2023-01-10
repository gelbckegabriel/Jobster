const express           = require('express');
const expressHandleBars = require('express-handlebars');
const app               = express();
const path              = require('path');
const db                = require('./db/connection');
const bodyParser        = require('body-parser');
const Job               = require('./models/Job');
const Sequelize         = require('sequelize');
const Op                = Sequelize.Op;

// PORT LISTENER.
const port = 3000;
app.listen(port, function() {
    console.log(`The app is working on the port ${port}!`);
});

// BODY PARSER.
app.use(bodyParser.urlencoded({ extended: false }));

// HANDLEBARS
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expressHandleBars.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

// DATABASE - CONNECTION.
db
    .authenticate()
    .then(() => {
        console.log('Connected to the database with success!');
    })
    .catch(error => {
        console.log('It occured an error while trying to connect to the database', error);
    });

// ROUTES.
app.get('/', (request, response) => {

    let search = request.query.job;
    let query  = '%' + search + '%'; // IT WILL FIND PARTIAL TITLES. EX: JAVAS => JAVASCRIPT.
    
    if(!search) {

        Job.findAll({
            order: [['createdAt', 'desc']]
        })
        .then(jobs => {
            response.render('index', {jobs})
        })
        .catch(error => console.log('An error occured: ', error));

    } else {

        Job.findAll({
            where: {title: {[Op.like]: query}},
            order: [['createdAt', 'desc']]
        })
        .then(jobs => {
            response.render('index', {jobs})
        })
        .catch(error => console.log('An error occured: ', error));

    }
    
});

// JOBS ROUTES.
app.use('/jobs', require('./routes/jobs_routes'));