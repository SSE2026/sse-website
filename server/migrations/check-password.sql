-- Check password hash
SELECT "id", "email", "password", "length(password)" as "pwd_length" FROM "users" WHERE "email" = 'admin@ssebatt.com';
