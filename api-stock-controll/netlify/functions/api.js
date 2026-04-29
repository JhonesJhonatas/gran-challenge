const express = require('express');
const serverless = require('serverless-http');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// In-memory store (resets per cold start — fine for demo)
const db = { products: [], companies: [], nextId: 1 };

// ─── Company ────────────────────────────────────────────────────────────────
app.get('/api/v1/company', (_, res) => res.json(db.companies));

app.post('/api/v1/company', (req, res) => {
  const company = { id: db.nextId++, ...req.body };
  db.companies.push(company);
  res.status(201).json({ message: 'Fornecedor cadastrado com sucesso!', data: company });
});

app.get('/api/v1/company/:id', (req, res) => {
  const company = db.companies.find(c => c.id === +req.params.id);
  if (!company) return res.status(404).json({ message: 'Fornecedor não encontrado' });
  res.json(company);
});

app.put('/api/v1/company/:id', (req, res) => {
  const idx = db.companies.findIndex(c => c.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Fornecedor não encontrado' });
  db.companies[idx] = { ...db.companies[idx], ...req.body };
  res.json({ message: 'Fornecedor atualizado com sucesso!', data: db.companies[idx] });
});

app.delete('/api/v1/company/:id', (req, res) => {
  db.companies = db.companies.filter(c => c.id !== +req.params.id);
  res.sendStatus(204);
});

// ─── Product ─────────────────────────────────────────────────────────────────
app.get('/api/v1/product', (_, res) => res.json(db.products));

app.post('/api/v1/product', (req, res) => {
  const product = { id: db.nextId++, ...req.body };
  db.products.push(product);
  res.status(201).json({ message: 'Produto cadastrado com sucesso!', data: product });
});

app.get('/api/v1/product/:id', (req, res) => {
  const product = db.products.find(p => p.id === +req.params.id);
  if (!product) return res.status(404).json({ message: 'Produto não encontrado' });
  res.json(product);
});

app.put('/api/v1/product/:id', (req, res) => {
  const idx = db.products.findIndex(p => p.id === +req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Produto não encontrado' });
  db.products[idx] = { ...db.products[idx], ...req.body };
  res.json({ message: 'Produto atualizado com sucesso!', data: db.products[idx] });
});

app.delete('/api/v1/product/:id', (req, res) => {
  db.products = db.products.filter(p => p.id !== +req.params.id);
  res.sendStatus(204);
});

// ─── Association ─────────────────────────────────────────────────────────────
app.post('/api/v1/product/:productId/company/:companyId', (req, res) => {
  res.json({ message: 'Fornecedor associado com sucesso ao produto!' });
});

app.delete('/api/v1/product/:productId/company/:companyId', (req, res) => {
  res.json({ message: 'Fornecedor desassociado com sucesso!' });
});

app.get('/api/v1/product/:productId/companies', (req, res) => {
  res.json([]);
});

app.get('/api/v1/company/:companyId/products', (req, res) => {
  res.json([]);
});

module.exports.handler = serverless(app);
