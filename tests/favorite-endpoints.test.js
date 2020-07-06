const request = require('supertest');
const app = require('../server.js');
const Favorite = require('../models/favorite.model.js');

describe('favorites endpoints', () => {
  describe('GET /favorites', () => {
    describe('when there are three favorites in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Favorite.create({
            user_id: 1,
            recipe_id: 4
          }),
          Favorite.create({
            user_id: 6,
            recipe_id: 1
          }),
          Favorite.create({
            user_id: 4,
            recipe_id: 3
          })
        ]);
        res = await request(app).get('/favorites');
      });

      it('status is 200', async () => {
        expect(res.status).toBe(200);
      });

      it('the returned data is an array containing three elements', async () => {
        expect(Array.isArray(res.body.data));
        expect(res.body.data.length).toBe(3); // <-- Ahahaha des barres
      });
    });
  });

  describe('POST /favorites', () => {
    describe('when a valid payload is sent', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/favorites').send({
          user_id: 2,
          recipe_id: 8
        });
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created favorite', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
      /*  Inutile, pas de body , à delete
        it("returns the score and content of the created favorite", async () => {
        expect(res.body.data).toHaveProperty("score");
      }); */
    });
  });
});
