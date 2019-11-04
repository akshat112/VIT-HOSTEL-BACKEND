//reference url https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai
process.env.NODE_ENV = 'test';

//let mongoose = require("mongoose");
let Student = require('../app/models/student');
let Request = require('../app/models/clean_req');
let Feedback = require('../app/models/feedback');
let Complain = require('../app/models/complains');

//Require the dev-dependencies
let chai = require('chai');
let chaiHTTP = require('chai-http');
let server = require('../app');
let should = chai.should();
let expect = chai.expect;

chai.use(chaiHTTP);

const prefix = '/users/';

describe('Students', ()=>{

    describe('Valid requests', ()=>{
        it('User registrations', ()=>{
            //user first time registration and data not available in db
            chai.request(server)
                .post(prefix)
                .type('form-data')//'x-www-form-urlencoded')
                .set('cookies', 'registerNumber=17BCE2250')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                    'num': 333,
                    'bed': 6,
                    'block': 'Q',
                    'type': 'boys',
                    'name': 'NIkHiL JaIN',
                    'registerNumber': "17BCE2250"})
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').eql("OK");
                    res.session.cookies.should.be.a('object');//have.property('registerNumber');
                });
        });

        //.set('Cookie', 'cookieName=cookieValue;otherName=otherValue')
        /*it('Room cleaning request', ()=>{
            //first time request for room cleaning 
            chai.request(server)
                .get(`${prefix}clean/request/`)
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').eql("OK");
                    //res.body.should.have.property('data').eql("done");
                });
        });

        it('Repeated Room cleaning request without done previous', ()=>{
            //repeating request for room cleaning 
            chai.request(server)
                .get(`${prefix}clean/request/`)
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').eql("OK");
                    res.body.should.have.property('data').eql("exist");
                });
        });*/

        /*it('Request for room cleaning is done', ()=>{
            chai.request(server)
                .post(`${prefix}clean/request/complete/`)
                .type('form')
                .send({'bribe': true})
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').eql("OK");
                });
        });

        it('App feedback', ()=>{
            chai.request(server)
                .post(`${prefix}app/feedback/`)
                .type('form')
                .send({
                    'type': "feature",
                    'context': "Give some time to UI/UX"
                })
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').eql("OK");
                });
        });

        it('Room complain', ()=>{
            chai.request(server)
                .post(`${prefix}report/complain/`)
                .type('form')
                .send({
                    'type': "washroom",
                    'context': "washroom is not cleaned by swappers"
                })
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').eql("OK");
                });
        });*/
    });
    /*describe('Invalid data requests', ()=>{

    });

    Student.deleteMany({}, err => {
        if (err) console.error.bind('Database error', err);
    });

    Feedback.deleteMany({}, err => {
        if (err) console.error.bind('Database error', err);
    });

    Complain.deleteMany({}, err => {
        if (err) console.error.bind('Database error', err);
    });*/
});