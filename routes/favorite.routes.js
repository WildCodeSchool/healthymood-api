const favoriteController = require('../controllers/favorite.controller.js');
const tryUser = require('../middlewares/tryUser.js');
const router = require('express').Router();

router.post('/', tryUser, favoriteController.create);
router.get('/', favoriteController.findAll);
router.get('/:id', favoriteController.findOne);
router.patch('/:id', favoriteController.update);
router.delete('/:id', favoriteController.delete);

module.exports = router;
