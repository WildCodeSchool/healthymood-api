const articlesController = require('../controllers/article.controller.js');
const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth');
const requireAdmin = require('../middlewares/requireAdmin');
const handleImageUpload = require('../middlewares/handleImageUpload.js');

router.post('/uploads', requireAuth, requireAdmin, handleImageUpload, articlesController.upload);
router.post('/', requireAuth, requireAdmin, articlesController.create);
router.get('/', articlesController.findAll);
router.get('/:id', articlesController.findOne);
router.patch('/:id', requireAuth, requireAdmin, articlesController.update);
router.delete('/:id', requireAuth, requireAdmin, articlesController.delete);

module.exports = router;
