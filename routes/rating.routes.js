const ratingsController = require('../controllers/rating.controller.js');
const tryUser = require('../middlewares/tryUser.js');
const router = require('express').Router();

router.post('/', tryUser, ratingsController.create);
router.get('/', ratingsController.findAll);
router.get('/:id', ratingsController.findOne);
router.patch('/:id', ratingsController.update);
router.delete('/:id', ratingsController.delete);

module.exports = router;
