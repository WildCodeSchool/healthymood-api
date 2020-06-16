const request = require('supertest');
const app = require('../server.js');
const RecipesCategory = require('../models/recipes_category.model.js');

describe('recipes_category endpoints', () => {
  describe('GET /recipes_category', () => {
    describe('when there are two recipes_category in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          RecipesCategory.create({ name: 'sauces' }),
          RecipesCategory.create({ name: 'boissons' })
        ]);
        res = await request(app).get('/recipes_category');
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

  describe('POST /recipes_category', () => {
    describe('when a valid payload is sent', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/recipes_category').send({
          name: 'boissons'
        });
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created recipes_category', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
    });

    describe('when a recipes_category with the same name already exists in DB', () => {
      let res;
      beforeAll(async () => {
        RecipesCategory.create({
          name: 'boissons'
        });
        res = await request(app).post('/recipes_category').send({
          name: 'boissons'
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
