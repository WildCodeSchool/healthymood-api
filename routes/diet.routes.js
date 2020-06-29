const diettypesController = require('../controllers/diet.controller.js');
const router = require('express').Router();

router.post('/', diettypesController.create);
router.get('/', diettypesController.findAll);
router.get('/:id', diettypesController.findOne);
router.put('/:id', diettypesController.update);
router.delete('/:id', diettypesController.delete);

module.exports = router;
