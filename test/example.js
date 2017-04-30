'use strict';

// process.env.NODE_ENV = 'test';

const test = require('tape');
const request = require('supertest');
const app = require('../examples/app');

const Pets = require('../examples/routes/pets').response;
const Users = require('../examples/routes/api').response.users;
const Home = require('../examples/routes/home').response;

test('Correct users returned', (t) => {
    request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            let expectedUsers = Users;

            t.error(err, 'No error');
            t.same(res.body, expectedUsers, 'Users as expected');
            t.end();
        });
});

test('Correct pets returned', (t) => {
    request(app)
        .get('/api/pets')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            let expectedUsers = Pets;

            t.error(err, 'No error');
            t.same(res.body, expectedUsers, 'Pets as expected');
            t.end();
        });
});

test('Correct home returned', (t) => {
    request(app)
        .get('/')
        .expect('Content-Type', /text/)
        .expect(200)
        .end((err, res) => {

            t.error(err, 'No error');
            t.same(res.text, Home, 'Home as expected');
            t.end();
        });
});
