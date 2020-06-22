const recipesController = require('../controllers/recipe.controller.js');
const router = require('express').Router();

router.post('/', recipesController.create);
router.get('/', recipesController.findAll, recipesController.findOne);
router.get('/:id', recipesController.findOne);
router.put('/:id', recipesController.update);
router.delete('/:id', recipesController.delete);

module.exports = router;
