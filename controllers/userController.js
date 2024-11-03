const catchAsync = require("../utils/catchAsync");
const prisma = require("../lib/prismaClient");
const AppError = require("../utils/appError");
const redisClient = require("../redis/redisClient");
const bcrypt = require('bcrypt');
const jwtFeatures = require("../utils/jwtFeature");



const createUser = catchAsync(async (req, res, next) => {
	const { firstName, lastName, email, password } = req.body;

	// Validate required fields and password strength
	if (!firstName || !lastName || !email || !password) {
		return next(new AppError("Invalid input data", 400));
	}

	const prevUser = await prisma.user.findUnique({
		where: {
			email,
		}
	})

	if (prevUser) {
		return next(new AppError("User With this Email Already exist", 404));
	}

	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 12); // Adjust salt rounds as needed

	const user = await prisma.user.create({
		data: {
			firstName,
			lastName,
			email,
			password: hashedPassword
		}
	});

	user.password = undefined;
	res.status(201).json({
		status: "success",
		user
	});
});

const loginUser = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new AppError("Provide Email and Password", 404))
	}

	const user = await prisma.user.findUnique({
		omit: {
			password: false // The password field is now selected.
		},
		where: {
			email: email,
		}
	})

	if (!user) {
		return next(new AppError("You don't Have an Account", 404))
	}


	const correctPassword = await bcrypt.compare(password, user.password);
	if (!correctPassword) {
		return next(new AppError("Please Provide a correct Password", 404));
	}

	const token = await jwtFeatures.signToken(user.id)

	const authTokenKey = `auth:${user.id}`;

	await redisClient.set(authTokenKey, token, 60 * 60 * 24);

	user.password = undefined;
	res.status(200).json({
		status: "success",
		user,
		token
	})
})

const allUsers = catchAsync(async (req, res, next) => {
	const users = await prisma.user.findMany();

	res.status(200).json({
		status: "success",
		users
	});
});


const profile = catchAsync(async (req, res, next) => {
	const userId = req.userId;


	const profile = await prisma.user.findUnique({
		where: {
			id: userId
		},
		select: {
			firstName: true,
			lastName: true,
			email: true,
			createdAt: true
		}
	})

	res.status(200).json({
		status: "Ok",
		data: profile
	})
})



const userBooks = catchAsync(async (req, res, next) => {
	const userId = req.userId;

	// let userbooks;
	// try {
	// 	userbooks = await prisma.user.findUniqueOrThrow({
	// 		relationLoadStrategy: 'join',
	// 		where: {
	// 			id: userId,
	// 		},
	// 		select: {
	// 			books: true
	// 		}
	// 	})
	// } catch (err) {
	// 	return next(new AppError("No user Found with This Id", 404))
	// }

	const userbooks = await prisma.user.findUnique({
		where: {
			id: userId
		},
		include: {
			books: {
				orderBy: {
					createdAt: 'desc',
				},
			}

		}
	})



	res.status(200).json({
		status: "OK",
		data: userbooks
	})
})

const delProfile = catchAsync(async (req, res, next) => {
	const userId = req.userId;


	await prisma.user.delete({
		where: {
			id: userId
		}
	})

	res.status(204).json({
		status: "Ok",
	})
})



module.exports = {
	createUser, allUsers, loginUser, profile, delProfile, userBooks
}