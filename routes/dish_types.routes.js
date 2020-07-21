const dishtypesController = require('../controllers/dish_types.controller.js');
const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth.js');
const requireAdmin = require('../middlewares/requireAdmin.js');

router.post('/', requireAuth, requireAdmin, dishtypesController.create);
router.get('/all', dishtypesController.findAll);
router.get('/', dishtypesController.findSome);
router.get('/:id', dishtypesController.findOne);
router.patch('/:id', requireAuth, requireAdmin, dishtypesController.update);
router.delete('/:id', requireAuth, requireAdmin, dishtypesController.delete);

module.exports = router;
