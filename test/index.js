//reference url https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

//Require the dev-dependencies
let chai = require('chai');
let chaiHTTP = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHTTP);

describe('Main route', ()=>{

    describe('Valid request', ()=>{
        it('Server is running', ()=>{
            chai.request(server)
                .get(`/test/`)
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('msg').eql("OK");
                });
        });
    });

    describe('Invalid request', ()=>{});
});