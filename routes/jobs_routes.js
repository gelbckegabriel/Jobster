const express   = require('express');
const router    = express.Router();
const Job       = require('../models/Job');

// ADDING TESTING ROUTE.
router.get('/test', (request, response) => {
    response.send('it worked.');
});

// SEE JOB OVERVIEW.
router.get('/view/:id', (request, response) => Job.findOne({
        where: {id: request.params.id}
    })
    .then(job => {
        response.render('view', {job});
    })
    .catch(error => console.log('An error occured while trying to check the job', error))
);

// ROUTE FROM THE SEND FORM.
router.get('/add', (request, response) => {
    response.render('add');
});

// ADD JOB VIA POST.
router.post('/add', (request, response) => {

    let {title, description, company, salary, contact_email, new_job} = request.body;

    // INSERT DATA.
    Job.create({
        title, 
        description,
        company,
        salary,
        contact_email,
        new_job
    })
    .then(() => {response.redirect('/');})
    .catch(error => console.log('It occured an error while trying to add the new job.', error));

});

module.exports = router;