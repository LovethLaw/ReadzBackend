const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	firstname: {
		type: String,
		required: [true, "Provide Your firstname"]
	},
	lastname: {
		type: String,
		required: [true, "Provide Your lastname"]
	},
	username: {
		type: String,
		required: [true, "Provide a valid username"],
		unique: true,
	},

	email: {
		type: String,
		required: [true, "Provide an Email address"],
		unique: true,
		validate: [validator.isEmail, "Provide a valid Email"]
	},

	password: {
		type: String,
		required: [true, "please Provide a Password"],
	},

	confirmPassword: {
		type: String,
		required: [true, "please Provide a Password"],
		validate: {
			validator: function (value) {
				// `this` refers to the current document being saved
				return value === this.password;
			},
			message: `Passwords do not match`
		}
	}
})

userSchema.set('validateBeforeSave', true);
// Hashing user password and not keeping confirm password in database
userSchema.pre("save", async function (next) {
	this.password = await bcrypt.hash(this.password, 12);
	this.confirmPassword = undefined;
	next();
})

const User = mongoose.model("User", userSchema);
module.exports = User;