const diettypesController = require('../controllers/diet.controller.js');
const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth.js');
const requireAdmin = require('../middlewares/requireAdmin.js');

router.post('/', requireAuth, requireAdmin, diettypesController.create);
router.get('/all', diettypesController.findAll);
router.get('/', diettypesController.findSome);
router.get('/:id', diettypesController.findOne);
router.patch('/:id', requireAuth, requireAdmin, diettypesController.update);
router.delete('/:id', requireAuth, requireAdmin, diettypesController.delete);

module.exports = router;
