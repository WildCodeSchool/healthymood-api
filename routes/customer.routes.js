const customersController = require('../controllers/customer.controller.js');
const router = require('express').Router();

router.post('/', customersController.create);
router.get('/', customersController.findAll);
router.get('/:id', customersController.findOne);
router.put('/:id', customersController.update);
router.delete('/:id', customersController.delete);

module.exports = router;
