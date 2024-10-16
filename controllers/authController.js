const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwtFeatures = require("../utils/jwtFeature");
const redisClient = require("../redis/redisClient");
const prisma = require("../lib/prismaClient");

// ? AUTHENTICATION
const protect = catchAsync(async (req, res, next) => {
	if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
		return next(new AppError("Missing Authentication Header", 401));
	}

	const token = req.headers.authorization.split(" ")[1];

	const decoded = jwtFeatures.verifyToken(token);
	const authTokenKey = `auth:${decoded.id}`;

	const redisToken = await redisClient.get(authTokenKey);
	if (!redisToken) {
		return next(new AppError("Token has expired",))
	}

	try {
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				id: decoded.id,
			}
		})

	} catch (err) {
		return next(new AppError("User with this token is no longer available", 401))
	}

	// ! pass the current userId to the next middleware
	req.userId = decoded.id;
	next()
})


module.exports = { protect }