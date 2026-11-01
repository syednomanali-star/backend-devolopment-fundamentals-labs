# Lab 2 – SQLite Database and CRUD Operations

## Student Details

* Name: Syed Noman Ali
* Section: 112
* Branch: CSE – Generative AI

## Project Description

This project implements a Book Management API using Node.js, Express.js and SQLite.

## Technologies Used

* Node.js
* Express.js
* SQLite
* JavaScript

## Database Structure

Table: books

| Column | Data Type           |
| ------ | ------------------- |
| id     | INTEGER PRIMARY KEY |
| title  | TEXT                |
| author | TEXT                |
| price  | INTEGER             |
| pages  | INTEGER             |

## API Endpoints

| Method | Endpoint        | Description   |
| ------ | --------------- | ------------- |
| GET    | /books/         | Get all books |
| GET    | /books/:bookId/ | Get one book  |
| POST   | /books/         | Add a book    |
| PUT    | /books/:bookId/ | Update a book |
| DELETE | /books/:bookId/ | Delete a book |

## Installation

```bash
npm install
```

## Run the Project

```bash
npx nodemon server.js
```

Server runs at http://localhost:3000.

## Screenshots

See the screenshots folder for API testing and database verification evidence.
