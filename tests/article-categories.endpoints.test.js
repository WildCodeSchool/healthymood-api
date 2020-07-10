const request = require('supertest');
const app = require('../server.js');
const ArticlesCategory = require('../models/article-categories.model.js');
const { authenticateHelper } = require('../helpers/authenticateHelper');

describe('article-categories endpoints', () => {
  describe('GET /article-categories', () => {
    describe('when there are two article categories in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          ArticlesCategory.create({ name: 'information' }),
          ArticlesCategory.create({ name: 'a la une' })
        ]);
        res = await request(app).get('/article-categories');
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

  describe('POST /article-categories', () => {
    describe('when a user is not authenticated on admin', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/article-categories').send({
          name: 'info'
        });
      });

      it('returns 401 status', async () => {
        expect(res.statusCode).toEqual(401);
      });
    });
    describe('when user is authenticated', () => {
      let res;
      let token;
      beforeAll(async () => {
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        res = await request(app)
          .post('/article-categories')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'info'
          });
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created category', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
    });

    describe('when a article-categories with the same name already exists in DB', () => {
      let res;
      let token;
      beforeAll(async () => {
        await ArticlesCategory.create({
          name: 'follow'
        });
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        res = await request(app)
          .post('/article-categories')
          .set('Authorization', `Bearer ${token}`)
          .send({
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
