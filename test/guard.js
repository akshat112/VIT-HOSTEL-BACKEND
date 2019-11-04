//reference url https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Request = require('../app/models/clean_req');
let Feedback = require('../app/models/feedback');
let Complain = require('../app/models/complains');

//Require the dev-dependencies
let chai = require('chai');
let chaiHTTP = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHTTP);

describe('Camera', ()=>{

    describe('HTTP request', ()=>{
        it('Starting video recording', ()=>{
            chai.request(server)
                .get(`/users/`)
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').eql("OK");
                });
        });

    });
});

path=/users/;
_expires=2020-05-23T06:39:51.036Z;
originalMaxAge=25920000000;
httpOnly=false;
secure=true;
sameSite=true;
registerNumber=17BCE2250;
userId=0185459a-102a-467e-8f68-2ee5808538bb;