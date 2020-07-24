const request = require('supertest');
const app = require('../server.js');
const Diettypes = require('../models/diet.model.js');
const { authenticateHelper } = require('../helpers/authenticateHelper');

describe('diettypes endpoints', () => {
  describe('GET /diet', () => {
    describe('when there are two diettypes in DB', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Diettypes.create({ name: 'Gluten free' }),
          Diettypes.create({ name: 'Lactose free' })
        ]);
        res = await request(app).get('/diet');
      });
      it('status is 200', async () => {
        expect(res.status).toBe(200);
      });
      it('the returned data is an array containing two elements', async () => {
        expect(Array.isArray(res.body.data));
        expect(res.body.data.length).toBe(2);
      });
    });

    describe('Paginated diet types', () => {
      let res;
      beforeEach(async () => {
        await Promise.all([
          Diettypes.create({ name: 'sans gluten' }),
          Diettypes.create({ name: 'sans lactose' }),
          Diettypes.create({ name: 'sans beurre' }),
          Diettypes.create({ name: 'sans sucre' }),
          Diettypes.create({ name: 'sans lait' }),
          Diettypes.create({ name: 'sans oeufs' }),
          Diettypes.create({ name: 'sans poissons' }),
          Diettypes.create({ name: 'sans viande' }),
          Diettypes.create({ name: 'hyper protéïné' }),
          Diettypes.create({ name: 'cure de citron' }),
          Diettypes.create({ name: 'sans allergènes' }),
          Diettypes.create({ name: 'sans farine' }),
          Diettypes.create({ name: 'pleins de vitamines' }),
          Diettypes.create({ name: 'que des crudités' }),
          Diettypes.create({ name: 'sans huile' })
        ]);
        res = await request(app).get('/diet?per_page=8&page=1');
      });

      it('has 8 ressources per page', async () => {
        expect(res.body.data.length).toBe(8);
        expect(res.header['content-range']).toBe('1-8/15');
      });
    });
  });
  describe('POST /diet', () => {
    describe('when a user is not authenticated on admin', () => {
      let res;
      beforeAll(async () => {
        res = await request(app).post('/diet').send({
          name: 'Flexitarian'
        });
      });

      it('returns 401 status', async () => {
        expect(res.statusCode).toEqual(401);
      });
    });
    describe('when a valid payload is sent', () => {
      let token;
      let res;
      beforeAll(async () => {
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        res = await request(app)
          .post('/diet')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Flexitarian'
          });
      });
      it('returns 201 status', async () => {
        expect(res.statusCode).toEqual(201);
      });

      it('returns the id of the created diettypes', async () => {
        expect(res.body.data).toHaveProperty('id');
      });
    });
    describe('when a diettype with the same name already exists in DB', () => {
      let res;
      let token;
      beforeAll(async () => {
        token = await authenticateHelper({
          blocked: false,
          isAdmin: true
        });
        await Diettypes.create({
          name: 'Vegan'
        });
        res = await request(app)
          .post('/diet')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Vegan'
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
