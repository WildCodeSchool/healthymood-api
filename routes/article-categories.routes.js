const articlesCategoryController = require('../controllers/article-categories.controller.js');
const router = require('express').Router();

router.post('/', articlesCategoryController.create);
router.get('/', articlesCategoryController.findAll);
router.get('/:id', articlesCategoryController.findOne);
router.put('/:id', articlesCategoryController.update);
router.delete('/:id', articlesCategoryController.delete);

module.exports = router;
