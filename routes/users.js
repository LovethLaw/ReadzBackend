const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
/* GET users listing. */
router
	.get("/", userController.allUsers)
	.post('/signup', userController.createUser)
	.post("/login", userController.loginUser)
	.get("/profile", authController.protect, userController.profile)
	.delete("/profile", authController.protect, userController.delProfile)
	.get("/books", authController.protect, userController.userBooks)


module.exports = router;
