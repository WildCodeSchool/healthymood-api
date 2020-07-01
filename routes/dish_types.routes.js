const dishtypesController = require('../controllers/dish_types.controller.js');
const router = require('express').Router();

router.post('/', dishtypesController.create);
router.get('/', dishtypesController.findAll);
router.get('/:id', dishtypesController.findOne);
router.patch('/:id', dishtypesController.update);
router.delete('/:id', dishtypesController.delete);

module.exports = router;
