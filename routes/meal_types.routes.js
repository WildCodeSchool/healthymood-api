const mealtypesController = require('../controllers/meal_types.controller.js');
const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth.js');
const requireAdmin = require('../middlewares/requireAdmin.js');

router.post('/', requireAuth, requireAdmin, mealtypesController.create);
router.get('/all', mealtypesController.findAll);
router.get('/', mealtypesController.findSome);
router.get('/:id', mealtypesController.findOne);
router.patch('/:id', requireAuth, requireAdmin, mealtypesController.update);
router.delete('/:id', requireAuth, requireAdmin, mealtypesController.delete);

module.exports = router;
