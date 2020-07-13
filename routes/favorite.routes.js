const favoriteController = require('../controllers/favorite.controller.js');
const tryUser = require('../middlewares/tryUser.js');
const router = require('express').Router();

router.post('/', tryUser, favoriteController.create);
router.get('/', tryUser, favoriteController.findAll);
router.get('/:id', tryUser, favoriteController.findOne);
router.patch('/:id', tryUser, favoriteController.update);
router.delete('/:id', tryUser, favoriteController.delete);

module.exports = router;
