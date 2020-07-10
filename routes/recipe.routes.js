const recipesController = require('../controllers/recipe.controller.js');
const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth.js');
const requireAdmin = require('../middlewares/requireAdmin.js');

router.post('/', requireAuth, requireAdmin, recipesController.create);
router.get('/', recipesController.findAll);
router.get('/:id', recipesController.findOne);
router.patch('/:id', requireAuth, requireAdmin, recipesController.update);
router.delete('/:id', requireAuth, requireAdmin, recipesController.delete);

module.exports = router;
