-- Migration: Add User.customerId for ownership chain
-- User → Customer (1:1)

-- Add customerId column to users table
ALTER TABLE "users" ADD COLUMN "customerId" TEXT;

-- Add unique constraint for 1:1 relationship
ALTER TABLE "users" ADD CONSTRAINT "users_customerId_unique" UNIQUE ("customerId");

-- Add foreign key constraint
ALTER TABLE "users" ADD CONSTRAINT "users_customerId_fkey"
  FOREIGN KEY ("customerId") REFERENCES "customers"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- Add index for query optimization
CREATE INDEX "users_customerId_idx" ON "users"("customerId");
