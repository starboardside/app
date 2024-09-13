const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.')));

// In-memory data storage
let balance = 0;
const transactions = [];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/balance', (req, res) => {
  res.json({ balance });
});

app.post('/api/deposit', (req, res) => {
  const { amount } = req.body;
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  balance += amount;
  transactions.push({ type: 'deposit', amount, timestamp: new Date() });
  res.json({ balance, message: 'Deposit successful' });
});

app.post('/api/withdraw', (req, res) => {
  const { amount } = req.body;
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  if (balance < amount) {
    return res.status(400).json({ error: 'Insufficient funds' });
  }
  balance -= amount;
  transactions.push({ type: 'withdraw', amount, timestamp: new Date() });
  res.json({ balance, message: 'Withdrawal successful' });
});

app.get('/api/transactions', (req, res) => {
  res.json(transactions.slice(-10).reverse());
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});