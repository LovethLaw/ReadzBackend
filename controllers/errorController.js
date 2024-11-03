const AppError = require("../utils/appError");

const handleCastErrorProd = (err) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 404)
}

const handleDuplicateErrorProd = (err) => {
	const message = `Duplicate field: ${err.keyValue.name}`
	return new AppError(message, 404)
}

const validationError = (err) => {
	// Handle specific validation errors
	const messages = Object.values(err.errors).map(el => el.message)
	const errmessage = messages.join(". ");
	return new AppError(errmessage, 400);
}

const errDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	})
}

const errProd = (err, res) => {
	console.log(err.message)
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		})
		// ! programming error : dont leak to client
	} else {
		// ! log error to console
		console.error(err);
		// ! send a generic  messageS
		res.status(500).json({
			status: "error",
			message: "Something went error"
		})
	}
}

// ! Global error handler
module.exports = ((err, req, res, next) => {
	// console.log(err)
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === "development") {
		errDev(err, res)
	} else if (process.env.NODE_ENV === 'production') {

		let error = { ...err };
		error.message = err.message || "Something Went Wrong";
		if (err.name === 'CastError') {
			error = handleCastErrorProd(err);
		} else if (err.code === 11000) {
			error = handleDuplicateErrorProd(err)
		} else if (err.name === "ValidationError")
			error = validationError(err);
		errProd(error, res);
	}
	next();
})