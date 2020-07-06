const favoriteController = require('../controllers/favorite.controller.js');
const router = require('express').Router();

router.post('/', favoriteController.create);
router.get('/', favoriteController.findAll);
router.get('/:id', favoriteController.findOne);
router.patch('/:id', favoriteController.update);
router.delete('/:id', favoriteController.delete);

module.exports = router;
