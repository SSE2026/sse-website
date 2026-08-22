/**
 * Vercel Serverless Handler with Auth
 */
module.exports = (req, res) => {
  console.log('Request:', req.method, req.url);

  const url = req.url || '';

  // Health check
  if (url === '/api/v1/health' || url === '/v1/health' || url === '/health') {
    res.status(200).json({
      status: 'ok',
      message: 'Server working',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Auth login - handle multiple paths
  if (url === '/api/v1/auth/login' || url === '/api/v1/login' || url === '/v1/auth/login' || url === '/v1/login') {
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
        accessToken: 'mock-token-for-testing',
      });
      return;
    }

    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  // 404 for everything else
  res.status(404).json({
    statusCode: 404,
    message: 'Not Found',
    path: url,
  });
};
