const express = require('express');
const router = express.Router();

const { identifyContact } = require('../Controllers/identityController');

router.post('/identify', identifyContact);

module.exports = router;