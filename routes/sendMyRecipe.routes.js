const sendMyRecipeController = require('../controllers/sendMyrecipe.controller.js');
const router = require('express').Router();

router.post('/', sendMyRecipeController.create);

module.exports = router;
