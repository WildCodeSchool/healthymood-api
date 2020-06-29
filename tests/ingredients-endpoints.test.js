const request = require('supertest');
const app = require('../server.js');
const Ingredient = require('../models/ingredient.model.js');
const { describe, beforeAll } = require('jest-circus');

describe('ingredients endpoints', () => {
  describe('GET /ingredients', () => {
    describe('when there are two ingredients in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Ingredient.create({ name: 'patates', is_allergen: false }),
          Ingredient.create({ name: 'carottes', is_allergen: true })
        ]);
        res = await request(app).get('/ingredients');
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

  describe('POST /ingredients', () => {
    describe('When user is not authenticated', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/ingredients').send({
          name: 'navet',
          is_allergen: false
        });
      });
      it('returns 401 status', async () => {
        expect(res.statusCode).toEqual(401);
      });

      it('return an error message', async () => {
        expect(res.body).toHaveProperty('errorMessage');
      });
    });
    describe('when a valid payload is sent', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/ingredients').send({
          name: 'navet',
          is_allergen: false
        });
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created ingredient', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
    });

    describe('when an ingredient with the same name already exists in DB', () => {
      let res;
      beforeAll(async () => {
        await Ingredient.create({
          name: 'poireau',
          is_allergen: true
        });
        res = await request(app).post('/ingredients').send({
          name: 'poireau',
          is_allergen: true
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
