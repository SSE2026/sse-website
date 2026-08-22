/**
 * Simple Vercel Serverless Handler - Direct Express
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Request received:', req.method, req.url);

  if (req.url === '/api/v1/health' || req.url === '/v1/health') {
    return res.status(200).json({
      status: 'ok',
      message: 'Direct handler working',
      timestamp: new Date().toISOString(),
    });
  }

  if (req.url === '/api/v1/login' || req.url === '/v1/login') {
    const { email, password } = req.body || {};
    console.log('Login attempt:', email);

    if (email === 'admin@ssebatt.com' && password === 'SSEadmin2026!') {
      return res.status(200).json({
        user: {
          id: 'test-id',
          email: 'admin@ssebatt.com',
          name: 'Admin',
          role: 'ADMIN',
        },
        accessToken: 'test-token',
        tokenType: 'Bearer',
      });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.status(404).json({
    statusCode: 404,
    message: 'Not Found',
    path: req.url,
  });
}
