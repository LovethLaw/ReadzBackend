const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });


process.on("uncaughtException", err => {
	console.log(err.name, err.message);
	console.log('Uncaught Exception Shutting down');

})
const app = require("./app");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`App is running on port ${PORT}`)
})

process.on("unhandledRejection", err => {
	console.log(err.name, err.message);
	console.log('UNHANDLED REJECTION Shutting down');
	server.close(() => {
		process.exit(1);
	});
})