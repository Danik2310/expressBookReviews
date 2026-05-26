const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if(userswithsamename.length > 0) {
        return false;
    }
    return true;
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user) => {
        return user.username === username && user.password === password;
    });
    if(validusers.length > 0) {
        return true;
    }
    return false;
}

regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }

    if(authenticatedUser(username, password)) {
        let accessToken = jwt.sign({ data: username }, 'fingerprint_customer', { expiresIn: 60 * 60 });
        req.session.authorization = { accessToken, username };
        return res.status(200).json({message: "Login successful!"});
    } else {
        return res.status(401).json({message: "Invalid Login. Check username and password"});
    }
});

// Add or edit a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviewText = req.query.review;
    const username = req.user.data;

    if(!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }

    books[isbn].reviews[username] = reviewText;

    return res.status(200).json({message: "Review added/updated successfully", reviews: books[isbn].reviews});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.data;

    if(!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }

    if(books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({message: `Review for ISBN ${isbn} deleted successfully`});
    } else {
        return res.status(404).json({message: "Review not found"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
