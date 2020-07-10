const AddressesController = require('../controllers/addresse.controller.js');
const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth.js');
const requireAdmin = require('../middlewares/requireAdmin.js');

router.post('/', requireAuth, requireAdmin, AddressesController.create);
router.get('/', requireAuth, requireAdmin, AddressesController.findAll);
router.get('/:id', requireAuth, AddressesController.findOne);
router.patch('/:id', requireAuth, requireAdmin, AddressesController.update);
router.delete('/:id', requireAuth, requireAdmin, AddressesController.delete);

module.exports = router;
