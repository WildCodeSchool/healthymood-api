const request = require('supertest');
const app = require('../server.js');
const GenericPage = require('../models/generic_pages.model.js');
const { authenticateHelper } = require('../helpers/authenticateHelper');

describe('genericPage endpoints', () => {
  describe('GET /generic_pages', () => {
    describe('when there are two generic pages in DB', () => {
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
    describe('Paginated generic pages', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          GenericPage.create({
            title: 'Generic page 1',
            slug: 'generic-page-1',
            published: true,
            content: 'azpjerâzj',
            user_id: 1
          }),
          GenericPage.create({
            title: 'Generic page 2',
            slug: 'generic-page-2',
            published: true,
            content: 'azpjerâzj',
            user_id: 1
          }),
          GenericPage.create({
            title: 'Generic page 3',
            slug: 'generic-page-3',
            published: true,
            content: 'azpjerâzj',
            user_id: 1
          }),
          GenericPage.create({
            title: 'Generic page 4',
            slug: 'generic-page-4',
            published: true,
            content: 'azpjerâzj',
            user_id: 1
          }),
          GenericPage.create({
            title: 'Generic page 5',
            slug: 'generic-page-5',
            published: true,
            content: 'azpjerâzj',
            user_id: 1
          }),
          GenericPage.create({
            title: 'Generic page 6',
            slug: 'generic-page-6',
            published: true,
            content: 'azpjerâzj',
            user_id: 1
          }),
          GenericPage.create({
            title: 'Generic page 7',
            slug: 'generic-page-7',
            published: true,
            content: 'azpjerâzj',
            user_id: 1
          }),
          GenericPage.create({
            title: 'Generic page 8',
            slug: 'generic-page-8',
            published: true,
            content: 'azpjerâzj',
            user_id: 1
          }),
          GenericPage.create({
            title: 'Generic page 9',
            slug: 'generic-page-9',
            published: true,
            content: 'azpjerâzj',
            user_id: 1
          }),
          GenericPage.create({
            title: 'Generic page 10',
            slug: 'generic-page-10',
            published: true,
            content: 'azpjerâzj',
            user_id: 1
          }),
          GenericPage.create({
            title: 'Generic page 11',
            slug: 'generic-page-11',
            published: true,
            content: 'azpjerâzj',
            user_id: 1
          }),
          GenericPage.create({
            title: 'Generic page 12',
            slug: 'generic-page-12',
            published: true,
            content: 'azpjerâzj',
            user_id: 1
          }),
          GenericPage.create({
            title: 'Generic page 13',
            slug: 'generic-page-13',
            published: true,
            content: 'azpjerâzj',
            user_id: 1
          }),
          GenericPage.create({
            title: 'Generic page 14',
            slug: 'generic-page-14',
            published: true,
            content: 'azpjerâzj',
            user_id: 1
          }),
          GenericPage.create({
            title: 'Generic page 15',
            slug: 'generic-page-15',
            published: true,
            content: 'azpjerâzj',
            user_id: 1
          })
        ]);
        res = await request(app).get('/generic_pages?per_page=8&page=1');
      });

      it('has 8 ressources per page', async () => {
        expect(res.body.data.length).toBe(8);
        expect(res.header['content-range']).toBe('1-8/15');
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
