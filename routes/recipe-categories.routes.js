const recipesCategoryController = require('../controllers/recipe-categories.controller.js');
const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth.js');
const requireAdmin = require('../middlewares/requireAdmin.js');

router.post('/', requireAuth, requireAdmin, recipesCategoryController.create);
router.get('/', recipesCategoryController.findAll);
router.get('/:id', recipesCategoryController.findOne);
router.patch(
  '/:id',
  requireAuth,
  requireAdmin,
  recipesCategoryController.update
);
router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  recipesCategoryController.delete
);

module.exports = router;
