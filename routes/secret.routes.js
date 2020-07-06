const secretController = require('../controllers/secret.controller.js');
const router = require('express').Router();

router.get('/', secretController.show);

module.exports = router;
