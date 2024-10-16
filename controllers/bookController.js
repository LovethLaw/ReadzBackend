const catchAsync = require("../utils/catchAsync");
const prisma = require("../lib/prismaClient");
const AppError = require("../utils/appError");


const allBooks = catchAsync(async (req, res, next) => {
	const books = await prisma.book.findMany({});

	res.status(200).json({
		status: "success",
		books
	});
})


const createBook = catchAsync(async (req, res, next) => {
	const { description, author, book_url, startDate, endDate } = req.body;
	const userId = req.userId;

	if (!author || !book_url || !description || !startDate || !endDate) {
		return next(new AppError("Missing Important Fields", 404));
	}

	const book = await prisma.book.create({
		data: {
			user_id: userId,
			author,
			description,
			endDate: new Date(endDate),
			startDate: new Date(startDate),
			book_url,
		}
	})

	res.status(201).json({
		status: "OK",
		book
	})

})


const getBook = catchAsync(async (req, res, next) => {
	const userId = req.userId;
	const bookId = req.params.bookId;

	const book = await prisma.user.findUnique({
		where: {
			id: userId,
		},
		select: {
			books: {
				where: {
					id: bookId
				}
			}
		}
	})

	res.status(200).json({
		status: "OK",
		data: book
	})
})


const deleteBook = catchAsync(async (req, res, next) => {
	const userId = req.userId;
	const bookId = req.params.bookId;

	try {
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				books: {
					delete: {
						id: bookId
					},
				},
			},
		})
	} catch (err) {
		return next(new AppError("This Book Doesn't Exist", 404));
	}

	res.status(204).json({
		status: 'success',
		data: null,
	});
});



module.exports = { allBooks, createBook, getBook, deleteBook }