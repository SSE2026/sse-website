-- Migration: add_user_role_enum
-- Description: Create UserRole enum and convert users.role from TEXT to UserRole
-- Created: 2026-08-21

-- 1. Create UserRole enum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ANALYST', 'ADMIN');

-- 2. Drop the existing default constraint before altering column type
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;

-- 3. Convert users.role from TEXT to UserRole enum with explicit cast
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole" USING "role"::"UserRole";

-- 4. Restore the default value
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER'::"UserRole";
