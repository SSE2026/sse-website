-- Password reset SQL for admin@shensafu.com
-- Run this against the production Neon PostgreSQL database
-- This updates ONLY the password field

UPDATE users
SET password = '$2b$10$UaxitaOrEQuoXdDMogxnpuEyWxag4Ig1ID1TEoVyAiJp6mSMOWxZS'
WHERE email = 'admin@shensafu.com';
