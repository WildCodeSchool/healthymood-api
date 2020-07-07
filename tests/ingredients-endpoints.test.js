const request = require('supertest');
const app = require('../server.js');
const Ingredient = require('../models/ingredient.model.js');
const { authenticateHelper } = require('../helpers/authenticateHelper');

describe('ingredients endpoints', () => {
  describe('GET /ingredients', () => {
    describe('when there are two ingredients in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Ingredient.create({
            name: 'patates',
            is_allergen: false,
            calories: 100
          }),
          Ingredient.create({
            name: 'carottes',
            is_allergen: true,
            calories: 200
          })
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
    describe('when a user is not authenticated on admin', () => {
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
    });
    describe('when a valid payload is sent', () => {
      let res;
      let token;
      beforeAll(async () => {
        res = await request(app).post('/ingredients').send({
          name: 'navet',
          is_allergen: false,
          calories: 100
        });
        token = (await authenticateHelper({
          blocked: false,
          isAdmin: true
        }));
      });

      describe('when a valid payload is sent', () => {
        beforeAll(async () => {
          res = await request(app)
            .post('/ingredients')
            .set('Authorization', `Bearer ${token}`)
            .send({
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
    });

    describe('when an ingredient with the same name already exists in DB and user is authenticated has an admin', () => {
      let res;
      let token;
      beforeAll(async () => {
        Ingredient.create(
          {
            name: 'poireau',
            is_allergen: true,
            calories: 90
          },
          token = (await authenticateHelper({ blocked: false, isAdmin: true }))
        );
        res = await request(app)
          .post('/ingredients')
          .set('Authorization', `Bearer ${token}`)
          .send({
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
