const express = require('express');
const router = express.Router();
const bookController = require("../controllers/bookController");
const authController = require("../controllers/authController");

/* GET home page. */
router
  .get('/', bookController.allBooks)
  .post('/create-book', authController.protect, bookController.createBook)
  .get("/:bookId", authController.protect, bookController.getBook)
  .delete("/:bookId", authController.protect, bookController.deleteBook)


module.exports = router;
