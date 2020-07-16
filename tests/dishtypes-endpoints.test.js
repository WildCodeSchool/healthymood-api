const request = require('supertest');
const app = require('../server.js');
const Dishtypes = require('../models/dish_types.model.js');
const { authenticateHelper } = require('../helpers/authenticateHelper');

describe('dishtypes endpoints', () => {
  describe('GET /dish_types', () => {
    describe('when there are two dishtypes in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Dishtypes.create({ name: 'entrée' }),
          Dishtypes.create({ name: 'dessert' })
        ]);
        res = await request(app).get('/dish_types');
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
  describe('POST /dish_types', () => {
    describe('when a user is not authenticated on admin', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/dish_types').send({
          name: 'dessert'
        });
      });

      it('returns 401 status', async () => {
        expect(res.statusCode).toEqual(401);
      });
    });
    describe('when a valid payload is sent', () => {
      let res;
      let token;
      beforeAll(async () => {
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        res = await request(app)
          .post('/dish_types')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'dessert'
          });
      });
      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created dishtypes', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
    });
    describe('when a dishtype with the same name already exists in DB', () => {
      let token;
      let res;
      beforeAll(async () => {
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        await Dishtypes.create({
          name: 'plat chaud'
        });
        res = await request(app)
          .post('/dish_types')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'plat chaud'
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
