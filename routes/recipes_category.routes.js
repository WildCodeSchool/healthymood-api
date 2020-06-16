const recipesCategoryController = require('../controllers/recipes_category.controller.js');
const router = require('express').Router();

router.post('/', recipesCategoryController.create);
router.get('/', recipesCategoryController.findAll);
router.get('/:id', recipesCategoryController.findOne);
router.put('/:id', recipesCategoryController.update);
router.delete('/:id', recipesCategoryController.delete);

module.exports = router;
