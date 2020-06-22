const genericPagesController = require('../controllers/generic_page.controller.js');
const router = require('express').Router();

router.post('/', genericPagesController.create);
router.get('/', genericPagesController.findAll);
router.get('/:id', genericPagesController.findOne);
router.put('/:id', genericPagesController.update);
router.delete('/:id', genericPagesController.delete);

module.exports = router;
