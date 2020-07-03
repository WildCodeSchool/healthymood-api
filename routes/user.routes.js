const usersController = require('../controllers/user.controller.js');
const router = require('express').Router();

router.post('/', usersController.create);
router.get('/', usersController.findAll);
router.get('/:id', usersController.findOne);
router.patch('/:id', usersController.update);
router.delete('/:id', usersController.delete);

module.exports = router;
