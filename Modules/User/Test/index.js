var expect = require('chai').expect;
var request = require('supertest');

var server = request.agent("http://localhost:5000");
// UNIT test begin
let token,id =  ''

function random(low, high) {
    return Math.random() * (high - low) + low
}

const registerCredentials = {
    email:  random(1, 10)+'test@gmail.com',
    password: '123456',
    title: "Mr",
    phone: random(1, 10),
    user_type: 'admin',
    first_name: 'Test',
    last_name: 'Cases'
}

const userCredentials = {
    email: 'adedotunolawale@gmail.com',
    password: '123456'
}

describe("api/users", () => {

    describe('Register API', function() {
        it('Should success if user registration is valid', function(done) {
            server
                .post('/api/register')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(registerCredentials)
                .expect(201)
                .expect('Content-Type', /json/)
                .expect(function(response) {
                    id = response.body.user._id;
                    expect(response.statusCode).to.equal(201);
                    expect(response.body).to.be.an('object');
                    expect(response.body.user).to.exist;
                })
                .end(done);
        });
    });

    describe('Login API', function() {
        it('Should success if credential is valid', function(done) {
            server
                .post('/api/login')
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .send(userCredentials)
                .expect(201)
                .expect('Content-Type', /json/)
                .expect(function(response) {
                    token = response.body.token
                    expect(response.statusCode).to.equal(201);
                    expect(response.body).to.be.an('object');
                    expect(response.body.token).to.exist;
                })
                .end(done);
        });
    });

    describe("DELETE /:id", () => {
        it("should delete requested id and return response 201", function(done) {
            server
            .delete('/api/user/'+ id)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization' , token)
            .expect(201)
            .expect('Content-Type', /json/)
            .expect(function(response) {
                expect(response.statusCode).to.equal(201);
                expect(response.body).to.be.an('object');
                expect(response.body.msg).to.exist;
            })
            .end(done);
        });
    
        it("should return 501 when deleted user is requested", function(done) {
            server
            .delete('/api/user/'+ id)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .set('Authorization' , token)
            .expect(501)
            .expect('Content-Type', /json/)
            .expect(function(response) {
                expect(response.statusCode).to.equal(501);
                expect(response.body).to.be.an('object');
                expect(response.body.msg).to.exist;
            })
            .end(done);
        });
    });
});