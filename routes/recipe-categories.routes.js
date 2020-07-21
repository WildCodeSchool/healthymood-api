const recipesCategoryController = require('../controllers/recipe-categories.controller.js');
const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth.js');
const requireAdmin = require('../middlewares/requireAdmin.js');

router.post('/', requireAuth, requireAdmin, recipesCategoryController.create);
router.get('/all', recipesCategoryController.findAll);
router.get('/', recipesCategoryController.findSome);
router.get('/:id', recipesCategoryController.findOne);
router.get('/:id/recipes', recipesCategoryController.findAllRecipes);
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
