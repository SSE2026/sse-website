// Local backend for testing (DATABASE_URL is loaded from .env.local)
require('dotenv').config({ path: '.env.local' });

const express = require('express');
const handler = require('./api/index.js');

const app = express();
app.use(express.json());
app.use((req, res) => handler(req, res));
app.listen(3001, () => console.log('Local backend on 3001'));