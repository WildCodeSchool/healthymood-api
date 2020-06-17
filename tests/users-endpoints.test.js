const request = require('supertest');
const app = require('../server.js');
const User = require('../models/user.model.js');

describe('users endpoints', () => {
  describe('GET /users', () => {
    describe('when there are two users in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          User.create({
            username: 'ana',
            email: 'ana@gmail.cwo',
          }),
          User.create({
            username: 'ana2',
            email: 'ana@gmail.co'
          })
        ]);
        res = await request(app).get('/users');
      });

      it('status is 200', async () => {
        expect(res.status).toBe(200);
      });

      it('the returned data is an array containing two elements', async () => {
        expect(Array.isArray(res.body.data));
        expect(res.body.data.length).toBe(2);
      });
    });
  });

  describe('POST /users', () => {
    describe('when a valid payload is sent', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/users').send({
          username: 'bbbb',
          email: 'bbbb@gmail.co',
          password: 'superpassword',
          firstname: 'bb',
          lastname: 'bababa',
          is_admin: false,
          blocked: false,
          fb_uid: 'myfbuid',
          avatar: 'cheese :-)'
        });
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created user', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
    });

    describe('when a user with the same username already exists in DB', () => {
      let res;
      beforeAll(async () => {
        User.create({
          username: 'ana',
          email: 'ana3@gmail.co'
        });
        res = await request(app).post('/users').send({
          username: 'ana',
          email: 'ana3@gmail.co'
        });
      });

      it('returns a 400 status', async () => {
        expect(res.status).toBe(400);
      });

      it('retuns an error message', async () => {
        expect(res.body).toHaveProperty('errorMessage');
      });
    });
  });
});
