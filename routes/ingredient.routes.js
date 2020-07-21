const ingredientsController = require('../controllers/ingredient.controller.js');
const requireAuth = require('../middlewares/requireAuth.js');
const requireAdmin = require('../middlewares/requireAdmin.js');
const router = require('express').Router();

router.post('/', requireAuth, requireAdmin, ingredientsController.create);
router.get('/all', ingredientsController.findAll);
router.get('/', ingredientsController.findSome);
router.get('/:id', ingredientsController.findOne);
router.patch('/:id', requireAuth, requireAdmin, ingredientsController.update);
router.delete('/:id', requireAuth, requireAdmin, ingredientsController.delete);

module.exports = router;
