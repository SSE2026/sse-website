/**
 * Simple Vercel Serverless Handler
 */
export default function handler(req: any, res: any) {
  console.log('Request:', req.method, req.url);

  if (req.url === '/api/v1/health' || req.url === '/v1/health') {
    res.status(200).json({
      status: 'ok',
      message: 'Direct handler working',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (req.url === '/api/v1/login' || req.url === '/v1/login') {
    const { email, password } = req.body || {};

    if (email === 'admin@ssebatt.com' && password === 'SSEadmin2026!') {
      res.status(200).json({
        user: {
          id: 'test-id',
          email: 'admin@ssebatt.com',
          name: 'Admin',
          role: 'ADMIN',
        },
        accessToken: 'test-token',
      });
      return;
    }

    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  res.status(404).json({
    statusCode: 404,
    message: 'Not Found',
    path: req.url,
  });
}
