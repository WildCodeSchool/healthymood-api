const mealtyperecipesController = require('../controllers/meal_type_recipes.controller.js');
const router = require('express').Router();

router.post('/', mealtyperecipesController.create);
router.get('/', mealtyperecipesController.findAll);
router.get('/:id', mealtyperecipesController.findOne);
router.patch('/:id', mealtyperecipesController.update);
router.delete('/:id', mealtyperecipesController.delete);

module.exports = router;
