const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (!isValid(username)) {
        return res.status(400).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        resolve(books);
    })
    .then(books => res.status(200).json(books))
    .catch(err => res.status(500).json({ message: err }));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject("Book not found");
    })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    new Promise((resolve, reject) => {
        let result = {};
        Object.keys(books).forEach((isbn) => {
            if (books[isbn].author.toLowerCase().includes(author)) {
                result[isbn] = books[isbn];
            }
        });
        if (Object.keys(result).length > 0) resolve(result);
        else reject("No books found by this author");
    })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(404).json({ message: err }));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    new Promise((resolve, reject) => {
        let result = {};
        Object.keys(books).forEach((isbn) => {
            if (books[isbn].title.toLowerCase().includes(title)) {
                result[isbn] = books[isbn];
            }
        });
        if (Object.keys(result).length > 0) resolve(result);
        else reject("No books found with this title");
    })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(404).json({ message: err }));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }
    return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
