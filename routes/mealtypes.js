const mealtypesController = require('../controllers/mealtypes.controller.js');
const router = require('express').Router();

router.post('/', mealtypesController.create);
router.get('/', mealtypesController.findAll);
router.get('/:id', mealtypesController.findOne);
router.put('/:id', mealtypesController.update);
router.delete('/:id', mealtypesController.delete);

module.exports = router;
