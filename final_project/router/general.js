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

// Función independiente para obtener todos los libros
const getAllBooks = () => {
    return new Promise((resolve, reject) => {
        if (books) resolve(books);
        else reject("No books found");
    });
};

// Función independiente para obtener libro por ISBN
const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject("Book not found");
    });
};

// Función independiente para obtener libros por autor
const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        let result = {};
        Object.keys(books).forEach((isbn) => {
            if (books[isbn].author.toLowerCase().includes(author.toLowerCase())) {
                result[isbn] = books[isbn];
            }
        });
        if (Object.keys(result).length > 0) resolve(result);
        else reject("No books found by this author");
    });
};

// Función independiente para obtener libros por título
const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
        let result = {};
        Object.keys(books).forEach((isbn) => {
            if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
                result[isbn] = books[isbn];
            }
        });
        if (Object.keys(result).length > 0) resolve(result);
        else reject("No books found with this title");
    });
};

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const result = await getAllBooks();
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const result = await getBookByISBN(req.params.isbn);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(404).json({ message: err });
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const result = await getBooksByAuthor(req.params.author);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(404).json({ message: err });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const result = await getBooksByTitle(req.params.title);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(404).json({ message: err });
    }
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
