const notificationsController = require('../controllers/notification.controller.js');
const router = require('express').Router();
const requireAuth = require('../middlewares/requireAuth.js');
const requireAdmin = require('../middlewares/requireAdmin.js');

router.post('/', requireAuth, requireAdmin, notificationsController.create);
router.get('/', notificationsController.findAll);
router.get('/:id', notificationsController.findOne);
router.patch('/:id', requireAuth, requireAdmin, notificationsController.update);
router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  notificationsController.delete
);

module.exports = router;
