const recipesController = require('../controllers/recipe.controller.js');
const tryUser = require('../middlewares/tryUser.js');
const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth.js');
const requireAdmin = require('../middlewares/requireAdmin.js');
const handleImageUpload = require('../middlewares/handleImageUpload.js');

router.post('/uploads', requireAuth, requireAdmin, handleImageUpload, recipesController.upload);
router.post('/', requireAuth, requireAdmin, recipesController.create);
router.get('/', recipesController.findAll);
router.get('/lastRecipes', recipesController.findLastRecipes);
router.get('/get-favorite', tryUser, recipesController.findFavoriteByUser_ID);
router.get('/:id', tryUser, recipesController.findOne);
router.patch('/:id', requireAuth, requireAdmin, recipesController.update);
router.delete('/:id', requireAuth, requireAdmin, recipesController.delete);

module.exports = router;
