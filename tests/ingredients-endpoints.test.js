const request = require('supertest');
const app = require('../server.js');
const Ingredient = require('../models/ingredient.model.js');

describe('ingredients endpoints', () => {
  describe('GET /ingredients', () => {
    describe('when there are two ingredients in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Ingredient.create({ name: 'patates', is_allergen: false, calories: 100 }),
          Ingredient.create({ name: 'carottes', is_allergen: true, calories: 200 })
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

    describe('Paginated ingredients', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Ingredient.create({ name: 'céleri', is_allergen: false, calories: 100 }),
          Ingredient.create({ name: 'crevette', is_allergen: true, calories: 50 }),
          Ingredient.create({ name: 'basilic', is_allergen: false, calories: 10 }),
          Ingredient.create({ name: 'parmesan', is_allergen: true, calories: 200 }),
          Ingredient.create({ name: 'courgette', is_allergen: false, calories: 60 }),
          Ingredient.create({ name: 'tomate', is_allergen: false, calories: 30 }),
          Ingredient.create({ name: 'carotte', is_allergen: true, calories: 35 }),
          Ingredient.create({ name: 'ail', is_allergen: false, calories: 25 }),
          Ingredient.create({ name: 'aubergine', is_allergen: true, calories: 55 }),
          Ingredient.create({ name: 'chou', is_allergen: false, calories: 46 }),
          Ingredient.create({ name: 'patate', is_allergen: false, calories: 72 }),
          Ingredient.create({ name: 'ciboulette', is_allergen: true, calories: 7 }),
          Ingredient.create({ name: 'mozza', is_allergen: false, calories: 180 }),
          Ingredient.create({ name: 'paprika', is_allergen: true, calories: 5 }),
          Ingredient.create({ name: 'thym', is_allergen: false, calories: 3 })
        ]);
        res = await request(app).get('/ingredientsq?per_page=10&page=1');
      });

      it('has 10 ressources per page', async () => {
        expect(res.body.data.length).toBe(10);
        expect(res.header['content-range']).toBe('1-10/15');
      });
    });
  });

  describe('POST /ingredients', () => {
    describe('when a valid payload is sent', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/ingredients').send({
          name: 'navet',
          is_allergen: false,
          calories: 100
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
          is_allergen: true,
          calories: 90
        });
        res = await request(app).post('/ingredients').send({
          name: 'poireau',
          is_allergen: true,
          calories: 90
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
