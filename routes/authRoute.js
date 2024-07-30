const {signup, login} = require('../controllers/authController');
const {authentication} = require('../utils/authUtils');
const router = require('express').Router();

router.route('/signup').post(signup);

router.route('/login').post(authentication, login);

module.exports = router;
