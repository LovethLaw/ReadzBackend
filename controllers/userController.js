const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

const createUser = catchAsync(async (req, res, next) => {
	const user = await User.create(req.body);

	res.status(200).json({
		status: "success",
		user
	});
})



module.exports = {
	createUser,
}