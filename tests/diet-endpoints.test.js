const request = require('supertest');
const app = require('../server.js');
const Diettypes = require('../models/diet.model.js');

describe('diettypes endpoints', () => {
  describe('GET /diet', () => {
    describe('when there are two diettypes in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Diettypes.create({ name: 'Gluten free' }),
          Diettypes.create({ name: 'Lactose free' })
        ]);
        res = await request(app).get('/diet');
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
  describe('POST /diet', () => {
    describe('when a valid payload is sent', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/diet').send({
          name: 'Flexitarian'
        });
      });
      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created diettypes', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
    });
    describe('when a diettype with the same name already exists in DB', () => {
      let res;
      beforeAll(async () => {
        await Diettypes.create({
          name: 'Vegan'
        });
        res = await request(app).post('/diet').send({
          name: 'Vegan'
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
