const { signup, login , forgotPassword, resetPassword} = require("../controllers/authController");
const { authentication } = require("../middleware/auth");
const router = require("express").Router();

router.route("/signup").post(signup);

router.route("/login").post(authentication, login);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:token').post(resetPassword);

module.exports = router;
