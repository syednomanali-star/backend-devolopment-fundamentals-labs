const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, 'library.db');

let db;

// Initialize Database and Server
const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        console.log('Connected to SQLite database');

        // Create Books Table
        await db.run(`
            CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                price INTEGER,
                pages INTEGER
            )
        `);

        console.log('Books table created successfully');

        // Insert books only if database is empty
        const result = await db.get(
            'SELECT COUNT(*) AS count FROM books'
        );

        if (result.count === 0) {
            const books = [
                ['JavaScript Basics', 'John Smith', 450, 250],
                ['C++ Fundamentals', 'James Wilson', 500, 180],
                ['Web Development', 'Robert Clark', 700, 320],
                ['Node.js Guide', 'David Miller', 550, 210],
                ['Database Systems', 'Thomas White', 650, 280],
                ['Learning React', 'Peter Jones', 750, 350],
                ['Computer Networks', 'Michael Green', 620, 200],
                ['Python Programming', 'Mark Lee', 600, 400],
                ['Express.js Handbook', 'Alex Brown', 400, 230],
                ['Data Structures', 'William Scott', 580, 300]
            ];

            for (const book of books) {
                await db.run(
                    `INSERT INTO books (title, author, price, pages)
                     VALUES (?, ?, ?, ?)`,
                    book
                );
            }

            console.log('10 books inserted successfully');
        }

        // GET: All books with search and sorting
app.get('/books/', async (req, res) => {
    try {
        const { search_q, order_by, order } = req.query;

        let query = 'SELECT * FROM books';
        const params = [];

        if (search_q) {
            query += ' WHERE title LIKE ?';
            params.push(`%${search_q}%`);
        }

        const allowedColumns = ['title', 'price', 'pages'];
        const sortColumn = allowedColumns.includes(order_by)
            ? order_by
            : 'id';

        const sortOrder = order && order.toUpperCase() === 'DESC'
            ? 'DESC'
            : 'ASC';

        query += ` ORDER BY ${sortColumn} ${sortOrder}`;

        const books = await db.all(query, params);

        res.status(200).json(books);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
        // GET: Single book
        app.get('/books/:bookId/', async (req, res) => {
            try {
                const { bookId } = req.params;

                const book = await db.get(
                    'SELECT * FROM books WHERE id = ?',
                    [bookId]
                );

                if (!book) {
                    return res.status(404).json({
                        message: 'Book not found'
                    });
                }

                res.status(200).json(book);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // POST: Add a new book
        app.post('/books/', async (req, res) => {
            try {
                const { title, author, price, pages } = req.body;

                if (!title || !author || price === undefined || pages === undefined) {
                    return res.status(400).json({
                        error: 'Title, author, price and pages are required'
                    });
                }

                const result = await db.run(
                    `INSERT INTO books (title, author, price, pages)
                     VALUES (?, ?, ?, ?)`,
                    [title, author, price, pages]
                );

                res.status(201).json({
                    message: 'Book added successfully',
                    id: result.lastID
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // PUT: Update a book
        app.put('/books/:bookId/', async (req, res) => {
            try {
                const { title, author, price, pages } = req.body;
                const { bookId } = req.params;

                if (!title || !author || price === undefined || pages === undefined) {
                    return res.status(400).json({
                        error: 'Title, author, price and pages are required'
                    });
                }

                const result = await db.run(
                    `UPDATE books
                     SET title = ?, author = ?, price = ?, pages = ?
                     WHERE id = ?`,
                    [title, author, price, pages, bookId]
                );

                if (result.changes === 0) {
                    return res.status(404).json({
                        message: 'Book not found'
                    });
                }

                res.status(200).json({
                    message: 'Book updated successfully'
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // DELETE: Remove a book
        app.delete('/books/:bookId/', async (req, res) => {
            try {
                const { bookId } = req.params;

                const result = await db.run(
                    'DELETE FROM books WHERE id = ?',
                    [bookId]
                );

                if (result.changes === 0) {
                    return res.status(404).json({
                        message: 'Book not found'
                    });
                }

                res.status(200).json({
                    message: 'Book deleted successfully'
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });

        // Start server after database connection
        app.listen(3000, () => {
            console.log('Server running at http://localhost:3000');
        });

    } catch (error) {
        console.error('Database initialization failed:', error.message);
        process.exit(1);
    }
};

initializeDBAndServer();