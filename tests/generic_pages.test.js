const request = require('supertest');
const app = require('../server.js');
const GenericPage = require('../models/generic_pages.model.js');
const { authenticateHelper } = require('../helpers/authenticateHelper');

describe('genericPage endpoints', () => {
  describe('GET /generic_pages', () => {
    describe('when there are two genericPage in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          GenericPage.create({
            title: 'Sauce tartare',
            slug: 'sauce-tartare-healthy',
            published: true,
            content: 'azpjerâzj',
            user_id: 1,
            display_in_footer: false
          }),
          GenericPage.create({
            title: 'Sauce bbq',
            slug: 'sauce-bbq-healthy',
            published: true,
            content: 'azdfdazd',
            user_id: 2,
            display_in_footer: false
          })
        ]);
        res = await request(app).get('/generic_pages');
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

  describe('POST /generic_pages', () => {
    describe('when a user is not authenticated on admin', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/dish_types').send({
          title: 'dzqdzqdz',
          slug: 'sauce-ketchup-healthy',
          published: true,
          content: 'gqes',
          user_id: 3,
          display_in_footer: false
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
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        res = await request(app)
          .post('/generic_pages')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'dzqdzqdz',
            slug: 'sauce-ketchup-healthy',
            published: true,
            content: 'gqes',
            user_id: 3,
            display_in_footer: false
          });
      });

      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created genericPages', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
    });

    describe('when an genericPage with the same name already exists in DB', () => {
      let res;
      let token;
      beforeAll(async () => {
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        await GenericPage.create({
          title: 'Sauce ketchup',
          slug: 'sauce-ketchup-healthy',
          published: true,
          content: 'gqes',
          user_id: 3,
          display_in_footer: false
        });
        res = await request(app)
          .post('/generic_pages')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'Sauce ketchup',
            slug: 'sauce-ketchup-healthy',
            published: true,
            content: 'gqes',
            user_id: 3,
            display_in_footer: false
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
