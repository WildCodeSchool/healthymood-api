const request = require('supertest');
const app = require('../server.js');
const Addresse = require('../models/addresse.model.js');
const { authenticateHelper } = require('../helpers/authenticateHelper');

describe('addresses endpoints', () => {
  describe('when a user is not authenticated on admin', () => {
    let res;
    beforeAll(async () => {
      res = await request(app).get('/users');
    });

    it('returns 401 status', async () => {
      expect(res.statusCode).toEqual(401);
    });
  });
  describe('GET /addresses', () => {
    describe('when there are two addresses in DB', () => {
      let res;
      let token;
      beforeEach(async () => {
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        await Promise.all([
          Addresse.create({
            street: 'avenue berthelot',
            zipcode: 69003,
            city: 'lyon',
            country: 'france'
          }),
          Addresse.create({
            street: 'chemin du paradis',
            zipcode: 46201,
            city: 'montcuq',
            country: 'france'
          })
        ]);
        res = await request(app)
          .get('/addresses')
          .set('Authorization', `Bearer ${token}`);
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

  describe('POST /addresses', () => {
    describe('when a valid payload is sent', () => {
      let res;
      let token;
      beforeAll(async () => {
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        res = await request(app)
          .post('/addresses')
          .set('Authorization', `Bearer ${token}`)
          .send({
            street: 'avenue berthelot',
            zipcode: 69003,
            city: 'lyon',
            country: 'france'
          });
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created addresse', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
    });
  });
});
