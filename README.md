# Express Book Reviews API

A RESTful API built with Node.js and Express that allows users to browse a book catalog, manage accounts, and post reviews. This project was developed as the final project for IBM's **Node.js & Express** course on Coursera.

> **Based on:** [ibm-developer-skills-network/expressBookReviews](https://github.com/ibm-developer-skills-network/expressBookReviews)

---

## Features

- Browse a catalog of classic books
- Search books by ISBN, author, or title
- User registration and login with JWT authentication
- Add, update, and delete book reviews (authenticated users only)
- Asynchronous data retrieval using **async/await** and **Promises**

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| JSON Web Tokens (JWT) | Authentication |
| express-session | Session management |
| Axios | HTTP client |
| Promises / async-await | Asynchronous operations |

---

## Project Structure

```
final_project/
├── router/
│   ├── general.js       # Public routes (no auth required)
│   ├── auth_users.js    # Protected routes (auth required)
│   └── booksdb.js       # In-memory book database
├── index.js             # Entry point
└── package.json
```

---

## Installation

```bash
# Clone the repository
git clone https://github.com/Danik2310/expressBookReviews.git
cd expressBookReviews/final_project

# Install dependencies
npm install

# Start the server
node index.js
```

The server runs on `http://localhost:5000`

---

## API Endpoints

### Public Routes (no login required)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all books |
| GET | `/isbn/:isbn` | Get book by ISBN |
| GET | `/author/:author` | Get books by author |
| GET | `/title/:title` | Get books by title |
| GET | `/review/:isbn` | Get reviews for a book |
| POST | `/register` | Register a new user |

### Protected Routes (login required)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/customer/login` | Login as registered user |
| PUT | `/customer/auth/review/:isbn` | Add or update a book review |
| DELETE | `/customer/auth/review/:isbn` | Delete your book review |

---

## Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}' \
  -c cookies.txt
```

### Add a review (requires login)
```bash
curl -X PUT "http://localhost:5000/customer/auth/review/1?review=Great+book" \
  -b cookies.txt
```

### Delete a review (requires login)
```bash
curl -X DELETE http://localhost:5000/customer/auth/review/1 \
  -b cookies.txt
```

---

## Authentication

This API uses **JWT (JSON Web Tokens)** for authentication. After logging in, the token is stored in the session. Protected routes validate the token on every request using middleware.

---

## Async Implementation

Book retrieval routes are implemented using **async/await with Promises** for non-blocking data access:

```javascript
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

public_users.get('/author/:author', async function (req, res) {
    try {
        const result = await getBooksByAuthor(req.params.author);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(404).json({ message: err });
    }
});
```

---

## License

This project is based on a template licensed under the [Apache License 2.0](LICENSE).

---

## Author

**Danik2310** — [@Danik2310](https://github.com/Danik2310)

*Final project for IBM Node.js & Express Course on Coursera*
