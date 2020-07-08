const articlesController = require('../controllers/article.controller.js');
const router = require('express').Router();

router.post('/', articlesController.create);
router.get('/', articlesController.findAll);
router.get('/', articlesController.findLast);
router.get('/:id', articlesController.findOne);
router.patch('/:id', articlesController.update);
router.delete('/:id', articlesController.delete);

module.exports = router;
