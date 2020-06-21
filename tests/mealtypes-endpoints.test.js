const request = require('supertest');
const app = require('../server.js');
const mealtypes = require('../models/meal_types.model.js');

describe('mealtypes endpoints', () => {
    describe('GET /meal_types', () => {
        describe('when there are two mealtypes in DB', () => {
            let res;
            beforeEach(async () => {
                await Promise.all([
                    mealtypes.create({ name: 'entrée' }),
                    mealtypes.create({ name: 'dessert' })
                ]);
                res = await request(app).get('/meal_types');
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
    describe('POST/meal_types', () => {
        describe('when a valid payload is sent', () => {
            let res;
            beforeAll(async () => {
                res = await request(app).post('/meal_types').send({
                    name: 'dessert'
                });
            });
            it('returns 201 status', async () => {
                expect(res.statusCode).toEqual(201);
            });

            it('returns the id of the created mealtypes', async () => {
                expect(res.body.data).toHaveProperty('id');
            });
        });
        describe('when a mealtype with the same name already exists in DB', () => {
            let res;
            beforeAll(async () => {
                mealtypes.create({
                    name: 'brunch'
                });
                res = await request(app).post('/meal_types').send({
                    name: 'brunch'
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
