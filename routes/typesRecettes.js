const typesRecettesController = require('../controllers/ingredient.controller.js');
const router = require('express').Router();

router.post('/', typesRecettesController.create);
router.get('/', typesRecettesController.findAll);
router.get('/:id', typesRecettesController.findOne);
router.put('/:id', typesRecettesController.update);
router.delete('/:id', typesRecettesController.delete);

module.exports = router;
