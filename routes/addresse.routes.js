const AddressesController = require('../controllers/addresse.controller.js');
const router = require('express').Router();

router.post('/', AddressesController.create);
router.get('/', AddressesController.findAll);
router.get('/:id', AddressesController.findOne);
router.put('/:id', AddressesController.update);
router.delete('/:id', AddressesController.delete);

module.exports = router;
