/* jshint esversion:6 */
/* globals describe, it, beforeEach */

/*
   Unit test for user profile related routes
*/

// During tests, set env variable to 'test' to disable Morgan
process.env.NODE_ENV = 'test';

const mongoose  = require('mongoose');
const User      = require('../models/user');
const chai      = require('chai');
const chaiHttp  = require('chai-http');
const server    = require('../server');
const should    = chai.should();

// variable test JWT - login w/Postman to obtain JWT first!
const token = process.env.TEST_JWT;

chai.use(chaiHttp);

// parent block
describe('User Profiles', () => {
    
    // get all user profiles in collection
    describe('/GET api/profiles', () => {
        it('should GET all the user profiles', (done) => {
            chai.request(server)
                .get('/api/profiles')
                .set('Authorization', `Bearer ${token}`)
                .end( (err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });
    
    // get a single user profile from collection
    describe('/GET /api/profile/:id', () => {
        it('should GET a single user profile', (done) => {
            chai.request(server)
                .get('/api/profile/5988a90cf89a15006fd75c0c')
                .set('Authorization', `Bearer ${token}`)
                .end( (err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.should.include.all.keys('_id', 'username', 'validated', 'email');
                    res.body.should.include({
                        _id : '5988a90cf89a15006fd75c0c',
                        username : 'anotherjay',
                        validated : true
                    });
                    done();
                });
        });
    });
    
});
