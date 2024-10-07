const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/* GET users listing. */
router.post('/signup', userController.createUser);

module.exports = router;
