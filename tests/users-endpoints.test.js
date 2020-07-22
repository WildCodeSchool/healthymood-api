const request = require('supertest');
const app = require('../server.js');
const User = require('../models/user.model.js');
const { authenticateHelper } = require('../helpers/authenticateHelper');

describe('users endpoints', () => {
  describe('when a user is not authenticated on admin', () => {
    let res;
    beforeAll(async () => {
      res = await request(app).get('/users');
    });

    it('returns 401 status', async () => {
      expect(res.statusCode).toEqual(401);
    });
  });
  describe('GET /users', () => {
    describe('when there are three users in DB', () => {
      let res;
      let token;
      beforeEach(async () => {
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        await Promise.all([
          User.create({
            username: 'ana',
            email: 'ana@gmail.cwo',
            password: 'ddddddddddd',
            is_admin: false,
            blocked: false
          }),
          User.create({
            username: 'ana2',
            email: 'ana@gmail.co',
            password: 'ifanrivgn',
            is_admin: true,
            blocked: false
          })
        ]);
        res = await request(app)
          .get('/users')
          .set('Authorization', `Bearer ${token}`);
      });

      it('status is 200', async () => {
        expect(res.status).toBe(200);
      });

      it('the returned data is an array containing three elements', async () => {
        expect(Array.isArray(res.body.data));
        expect(res.body.data.length).toBe(3);
      });
    });
    describe('Paginated users', () => {
      let res;
      let token;
      beforeEach(async () => {
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        await Promise.all([
          User.create({
            username: 'ana1',
            email: 'ana1@gmail.co',
            password: 'ana1',
            is_admin: true,
            blocked: false
          }),
          User.create({
            username: 'ana2',
            email: 'ana2@gmail.co',
            password: 'ana2',
            is_admin: false,
            blocked: false
          }),
          User.create({
            username: 'ana3',
            email: 'ana3@gmail.co',
            password: 'ana3',
            is_admin: false,
            blocked: false
          }),
          User.create({
            username: 'ana4',
            email: 'ana4@gmail.co',
            password: 'ana4',
            is_admin: false,
            blocked: false
          }),
          User.create({
            username: 'ana5',
            email: 'ana5@gmail.co',
            password: 'ana5',
            is_admin: false,
            blocked: false
          }),
          User.create({
            username: 'ana6',
            email: 'ana6@gmail.co',
            password: 'ana6',
            is_admin: false,
            blocked: false
          }),
          User.create({
            username: 'ana7',
            email: 'ana7@gmail.co',
            password: 'ana7',
            is_admin: false,
            blocked: false
          }),
          User.create({
            username: 'ana8',
            email: 'ana8@gmail.co',
            password: 'ana8',
            is_admin: false,
            blocked: false
          }),
          User.create({
            username: 'ana9',
            email: 'ana9@gmail.co',
            password: 'ana9',
            is_admin: false,
            blocked: false
          }),
          User.create({
            username: 'ana10',
            email: 'ana10@gmail.co',
            password: 'ana10',
            is_admin: false,
            blocked: false
          }),
          User.create({
            username: 'ana11',
            email: 'ana11@gmail.co',
            password: 'ana11',
            is_admin: false,
            blocked: false
          }),
          User.create({
            username: 'ana12',
            email: 'ana12@gmail.co',
            password: 'ana12',
            is_admin: true,
            blocked: false
          }),
          User.create({
            username: 'ana13',
            email: 'ana13@gmail.co',
            password: 'ana13',
            is_admin: false,
            blocked: false
          }),
          User.create({
            username: 'ana14',
            email: 'ana14@gmail.co',
            password: 'ana14',
            is_admin: true,
            blocked: false
          }),
          User.create({
            username: 'ana15',
            email: 'ana15@gmail.co',
            password: 'ana15',
            is_admin: true,
            blocked: false
          })
        ]);
        res = await request(app)
          .get('/users?per_page=8&page=1')
          .set('Authorization', `Bearer ${token}`);
      });

      it('has 8 ressources per page', async () => {
        expect(res.body.data.length).toBe(8);
        expect(res.header['content-range']).toBe('1-8/16');
      });
    });
  });

  describe('POST /users', () => {
    describe('when a valid payload is sent', () => {
      let res;
      let token;
      beforeAll(async () => {
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        res = await request(app).post('/users')
          .set('Authorization', `Bearer ${token}`)
          .send({
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

    describe('when a user with the same username or email already exists in DB', () => {
      let res;
      let token;
      beforeAll(async () => {
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        await User.create({
          username: 'ana',
          email: 'ana3@gmail.co',
          password: 'ffffffffffff',
          is_admin: true,
          blocked: false
        });
        res = await request(app).post('/users')
          .set('Authorization', `Bearer ${token}`)
          .send({
            username: 'ana',
            email: 'ana3@gmail.co',
            password: 'ffffffffffff',
            is_admin: true,
            blocked: false
          });
      });

      it('returns a 400 status', async () => {
        expect(res.status).toBe(400);
      });

      it('returns an error message', async () => {
        expect(res.body).toHaveProperty('errorMessage');
      });
    });
  });
});
