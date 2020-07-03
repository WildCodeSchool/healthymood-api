const notificationsController = require('../controllers/notification.controller.js');
const router = require('express').Router();

router.post('/', notificationsController.create);
router.get('/', notificationsController.findAll);
router.get('/:id', notificationsController.findOne);
router.patch('/:id', notificationsController.update);
router.delete('/:id', notificationsController.delete);

module.exports = router;
