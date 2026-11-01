const express = require('express');

const app = express();

// Route 1: Home
app.get('/', (req, res) => {
    res.send('Welcome to my Node.js and Express server!');
});

// Route 2: About
app.get('/about', (req, res) => {
    res.json({
        name: 'Syed Noman Ali',
        section: '112 (CSE Gen-AI)'
    });
});

// Route 3: Time
app.get('/time', (req, res) => {
    res.send(new Date().toString());
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

// Start server
app.listen(3000, () => {
    console.log('Express server running on port 3000');
});