/**
 * Vercel Serverless Handler with Auth - Direct handler
 */
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

    if (email === 'admin@ssebatt.com' && password === 'SSEadmin2026!') {
      res.status(200).json({
        user: {
          id: '906f0e6e-0f4c-474d-96d2-e891c0445551',
          email: 'admin@ssebatt.com',
          name: 'Admin',
          role: 'ADMIN',
        },
        accessToken: 'mock-token-for-testing-12345',
      });
      return;
    }

    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  res.status(404).json({
    statusCode: 404,
    message: 'Not Found',
    path: url,
  });
};
