const request = require('supertest');
const app = require('../server.js');
const GenericPage = require('../models/generic_pages.model.js');

xdescribe('genericPage endpoints', () => {
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
            user_id: 1
          }),
          GenericPage.create({
            title: 'Sauce bbq',
            slug: 'sauce-bbq-healthy',
            published: true,
            content: 'azdfdazd',
            user_id: 2
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
    describe('when a valid payload is sent', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/generic_pages').send({
          title: 'dzqdzqdz',
          slug: 'sauce-ketchup-healthy',
          published: true,
          content: 'gqes',
          user_id: 3
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
      beforeAll(async () => {
        GenericPage.create({
          title: 'Sauce ketchup',
          slug: 'sauce-ketchup-healthy',
          published: true,
          content: 'gqes',
          user_id: 3
        });
        res = await request(app).post('/generic_pages').send({
          title: 'Sauce ketchup',
          slug: 'sauce-ketchup-healthy',
          published: true,
          content: 'gqes',
          user_id: 3
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
