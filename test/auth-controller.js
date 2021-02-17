const expect = require('chai').expect;
const sinon  = require('sinon')
const User   = require('../model/user')
const AuthController = require('../controller/auth')
const FeedController = require('../controller/feed')
const request = require('supertest');
const app = require('../app');

describe('Auth Controller login & signup', () => {
    it('acess database',function(){
         sinon.stub(User,"findOne")
         User.findOne.throws()     
         const req = {
            body:{
                email:'testing@mail.com',
                password:'andihoerudin'
            }
         }
         AuthController.login(req,{},() => {}).then(result => {
             expect(result).to.be.an('error')
             expect(result).to.have.property('statusCode',500)
             done()
         })
         User.findOne.restore()
    })
    it('GET /feed/posts', async () => {
          const  response = await request(app).get('/feed/posts');
          expect(response.status).to.equal(200);
          //expect(response.body.message).to.property('message');
          expect(response.body.message).to.equal('Post Successfuly');
          //done()
      });
})
