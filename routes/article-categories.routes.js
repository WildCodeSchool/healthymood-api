const articlesCategoryController = require('../controllers/article-categories.controller.js');
const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');

router.post('/', requireAuth, requireAdmin, articlesCategoryController.create);
router.get('/', articlesCategoryController.findAll);
router.get('/:id', articlesCategoryController.findOne);
router.patch(
  '/:id',
  requireAuth,
  requireAdmin,
  articlesCategoryController.update
);
router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  articlesCategoryController.delete
);

module.exports = router;
