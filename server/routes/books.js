///////////////////////////////////////////////////////////
// 
// File name:       server/routes/books.js
// Author's name:   Sai Hung Chau
// Student ID:      301273830
// Web App name:    COMP229-F2023-MidTerm-301273830
// 
///////////////////////////////////////////////////////////

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {

    // render details page for add a new book
    res.render('../views/books/details', {title: "Add Book", books: "", displayName: req.user?req.user.displayName:''});

});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

    // insert a new book data to MongoDB atlas database
    let newBook = book({
        "Title": req.body.title,
        "Description": req.body.description,
        "Price": req.body.price,
        "Author": req.body.author,
        "Genre": req.body.genre,
    });
    book.create(newBook, (err, book) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            res.redirect('/books');
        }
    })

});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {

    // find the book object by ID and redner the details page for edit
    let id = req.params.id;
    book.findById({_id:id}, (err, bookToEdit) => {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            res.render('../views/books/details', {title: "Edit Book", books: bookToEdit, displayName: req.user?req.user.displayName:''});
        }
    })

});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {

    // save the book data by ID
    let id = req.params.id;
    let updatedBook = book({
        "_id": id,
        "Title": req.body.title,
        "Description": req.body.description,
        "Price": req.body.price,
        "Author": req.body.author,
        "Genre": req.body.genre,
    });
    book.updateOne({_id:id}, updatedBook, (err)=>{
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            res.redirect('/books');
        }
    });

});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {

    // find the book object bu ID and delete that data from database
    let id = req.params.id;
    book.remove({_id:id}, (err)=> {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            res.redirect("/books");
        }
    });

});


module.exports = router;
