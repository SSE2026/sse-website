/**
 * Simple Auth Handler with Database
 */
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

let cachedPool = null;

function getPool() {
  if (cachedPool) return cachedPool;
  cachedPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  return cachedPool;
}

module.exports = async function handler(req, res) {
  const url = req.url || '';
  console.log('Request:', req.method, url);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Health check
  if (url === '/api/v1/health' || url === '/v1/health') {
    res.status(200).json({
      status: 'ok',
      message: 'Server working',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Login - handle multiple paths
  const isLoginPath = url === '/api/v1/auth/login' ||
                      url === '/api/v1/login' ||
                      url === '/v1/auth/login' ||
                      url === '/v1/login' ||
                      url.includes('/auth/login');

  if (req.method === 'POST' && isLoginPath) {
    const { email, password } = req.body || {};
    console.log('Login attempt:', email);

    try {
      const pool = getPool();
      const result = await pool.query(
        'SELECT id, email, password, name, role, "isActive" FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        console.log('User not found');
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      const user = result.rows[0];
      console.log('Found user:', user.email, 'isActive:', user.isActive);

      if (!user.isActive) {
        res.status(401).json({ message: 'Account disabled' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isPasswordValid);

      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken: 'auth-token-' + user.id,
      });
      return;
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
      return;
    }
  }

  res.status(404).json({
    statusCode: 404,
    message: 'Not Found',
    path: url,
  });
};
