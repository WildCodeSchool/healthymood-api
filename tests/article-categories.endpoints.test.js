const request = require('supertest');
const app = require('../server.js');
const ArticlesCategory = require('../models/article-categories.model.js');

describe('article-categories endpoints', () => {
  describe('GET /article_categories', () => {
    describe('when there are two article categories in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          ArticlesCategory.create({ name: 'information' }),
          ArticlesCategory.create({ name: 'a la une' })
        ]);
        res = await request(app).get('/article_categories');
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

  describe('POST /article_categories', () => {
    describe('when a valid payload is sent', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/article_categories').send({
          name: 'info'
        });
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created article-categories', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
    });

    describe('when a article-categories with the same name already exists in DB', () => {
      let res;
      beforeAll(async () => {
        await ArticlesCategory.create({
          name: 'follow'
        });
        res = await request(app).post('/article_categories').send({
          name: 'follow'
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
