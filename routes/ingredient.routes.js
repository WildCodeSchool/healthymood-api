const ingredientsController = require('../controllers/ingredient.controller.js');
const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth');

router.post('/', requireAuth, ingredientsController.create);
router.get('/', ingredientsController.findAll);
router.get('/:id', ingredientsController.findOne);
router.put('/:id', requireAuth, ingredientsController.update);
router.delete('/:id', requireAuth, ingredientsController.delete);

module.exports = router;
