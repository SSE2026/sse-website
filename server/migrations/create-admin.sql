-- Create Admin User Only (Skip if tables exist)
-- Run this in Neon SQL Editor

-- Password: SSEadmin2026! (bcrypt hashed)
INSERT INTO "users" ("id", "email", "password", "name", "role", "isActive", "portalStatus", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid()::text,
    'admin@ssebatt.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mr/IK5Jj3G5VFW13qGV7XKIJ5Y5X5X5',
    'Admin',
    'ADMIN',
    true,
    'NONE',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- Verify admin was created
SELECT "email", "name", "role" FROM "users" WHERE "email" = 'admin@ssebatt.com';
