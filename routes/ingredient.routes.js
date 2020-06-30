const ingredientsController = require('../controllers/ingredient.controller.js');
const router = require('express').Router();
// const requireAuth = require("../middlewares/requireAuth");

router.post('/', ingredientsController.create);
router.get('/', ingredientsController.findAll);
router.get('/:id', ingredientsController.findOne);
router.put('/:id', ingredientsController.update);
router.delete('/:id', ingredientsController.delete);

module.exports = router;
