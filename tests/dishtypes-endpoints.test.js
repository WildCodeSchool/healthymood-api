const request = require('supertest');
const app = require('../server.js');
const Dishtypes = require('../models/dish_types.model.js');

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
    describe('when a valid payload is sent', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/dish_types').send({
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
      let res;
      beforeAll(async () => {
        await Dishtypes.create({
          name: 'plat chaud'
        });
        res = await request(app).post('/dish_types').send({
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
