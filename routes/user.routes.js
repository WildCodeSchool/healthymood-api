const usersController = require('../controllers/user.controller.js');
const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth.js');
const requireAdmin = require('../middlewares/requireAdmin.js');

router.post('/', usersController.create);
router.get('/', requireAuth, requireAdmin, usersController.findAll);
router.get('/:id', requireAuth, requireAdmin, usersController.findOne);
router.patch('/:id', requireAuth, usersController.update);
router.delete('/:id', requireAuth, requireAdmin, usersController.delete);

module.exports = router;
