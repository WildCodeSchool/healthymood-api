const recipesCategoryController = require('../controllers/recipe-categories.controller.js');
const router = require('express').Router();

router.post('/', recipesCategoryController.create);
router.get('/', recipesCategoryController.findAll);
router.get('/:id', recipesCategoryController.findOne);
router.patch('/:id', recipesCategoryController.update);
router.delete('/:id', recipesCategoryController.delete);

module.exports = router;
