const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/* GET users listing. */
router.post('/signup', userController.createUser).get("/", function(req, res,)=>{
	res.status(200).json({user:true});
})

module.exports = router;
