const express = require('express'); 
const router = express.Router(); 
const controller = require('../controller/controller')

router.post('/register', controller.register); 
router.post('/login', controller.login); 
router.get('/', controller.users); 
router.post('/search', controller.search); 

module.exports = router; 

