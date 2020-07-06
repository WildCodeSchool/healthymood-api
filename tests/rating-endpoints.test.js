const request = require('supertest');
const app = require('../server.js');
const Rating = require('../models/rating.model.js');

describe('ratings endpoints', () => {
  describe('GET /ratings', () => {
    describe('when there are three ratings in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Rating.create({
            score: 3,
            user_id: 1,
            recipe_id: 4
          }),
          Rating.create({
            score: 2,
            user_id: 6,
            recipe_id: 1
          }),
          Rating.create({
            score: 5,
            user_id: 4,
            recipe_id: 3
          })
        ]);
        res = await request(app).get('/ratings');
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

  describe('POST /ratings', () => {
    describe('when a valid payload is sent', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/ratings').send({
          score: 5,
          user_id: 2,
          recipe_id: 8
        });
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created rating', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
      it('returns the score and content of the created rating', async () => {
        expect(res.body.data).toHaveProperty('score');
      });
    });
  });
});
