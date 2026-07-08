-- ============================================================
-- AL GHAZI WOOD CRAFTS — Supabase SQL Setup
-- Run this entire script in the Supabase SQL Editor if
-- `prisma db push` cannot connect due to network restrictions.
-- ============================================================

-- Enable UUID extension (already enabled in most Supabase projects)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ──────────────────────────────────────────────────────────────
-- ENUMS
-- ──────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ──────────────────────────────────────────────────────────────
-- NEXTAUTH TABLES
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "User" (
  "id"            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name"          TEXT,
  "email"         TEXT UNIQUE,
  "emailVerified" TIMESTAMP,
  "image"         TEXT,
  "role"          "Role" NOT NULL DEFAULT 'USER'
);

CREATE TABLE IF NOT EXISTS "Account" (
  "id"                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId"            TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "type"              TEXT NOT NULL,
  "provider"          TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token"     TEXT,
  "access_token"      TEXT,
  "expires_at"        INTEGER,
  "token_type"        TEXT,
  "scope"             TEXT,
  "id_token"          TEXT,
  "session_state"     TEXT,
  UNIQUE("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "Session" (
  "id"           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId"       TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "expires"      TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token"      TEXT UNIQUE NOT NULL,
  "expires"    TIMESTAMP NOT NULL,
  UNIQUE("identifier", "token")
);

DO $$ BEGIN
  CREATE TYPE "PaymentMethod" AS ENUM ('ADVANCE', 'COD');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PARTIAL_ADVANCE', 'FULL_ADVANCE', 'PAID');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ──────────────────────────────────────────────────────────────
-- E-COMMERCE TABLES
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Product" (
  "id"              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name"            TEXT NOT NULL,
  "description"     TEXT NOT NULL,
  "originalPrice"   INTEGER NOT NULL,
  "discountedPrice" INTEGER NOT NULL,
  "image"           TEXT NOT NULL,
  "tag"             TEXT,
  "isAvailable"     BOOLEAN NOT NULL DEFAULT true,
  "createdAt"       TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Order" (
  "id"              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderNumber"     TEXT UNIQUE NOT NULL,
  "status"          "OrderStatus"   NOT NULL DEFAULT 'PENDING',
  "totalAmount"     INTEGER NOT NULL,
  "discountApplied" INTEGER NOT NULL DEFAULT 0,
  "paymentMethod"   "PaymentMethod" NOT NULL DEFAULT 'ADVANCE',
  "paymentStatus"   "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
  "customerName"    TEXT NOT NULL,
  "customerPhone"   TEXT NOT NULL,
  "customerEmail"   TEXT,
  "province"        TEXT NOT NULL,
  "district"        TEXT NOT NULL,
  "tehsil"          TEXT NOT NULL,
  "city"            TEXT NOT NULL,
  "addressLine"     TEXT NOT NULL,
  "createdAt"       TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt"       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ── Safe migration: add new columns if the table already exists ──────────────
-- (Run these if your Order table was created without the new columns)
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "discountApplied" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentMethod"   "PaymentMethod" NOT NULL DEFAULT 'ADVANCE';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentStatus"   "PaymentStatus" NOT NULL DEFAULT 'UNPAID';

CREATE TABLE IF NOT EXISTS "OrderItem" (
  "id"              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId"         TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "productId"       TEXT NOT NULL REFERENCES "Product"("id"),
  "quantity"        INTEGER NOT NULL,
  "priceAtPurchase" INTEGER NOT NULL
);


-- ──────────────────────────────────────────────────────────────
-- INDEXES for performance
-- ──────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS "Order_status_idx"        ON "Order"("status");
CREATE INDEX IF NOT EXISTS "Order_createdAt_idx"     ON "Order"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx"   ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS "OrderItem_productId_idx" ON "OrderItem"("productId");
CREATE INDEX IF NOT EXISTS "Product_isAvailable_idx" ON "Product"("isAvailable");

-- ──────────────────────────────────────────────────────────────
-- AUTO-UPDATE updatedAt trigger
-- ──────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "Product_updatedAt" ON "Product";
CREATE TRIGGER "Product_updatedAt"
  BEFORE UPDATE ON "Product"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS "Order_updatedAt" ON "Order";
CREATE TRIGGER "Order_updatedAt"
  BEFORE UPDATE ON "Order"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ──────────────────────────────────────────────────────────────
-- SEED DATA — 6 Products
-- ──────────────────────────────────────────────────────────────

INSERT INTO "Product" ("id", "name", "description", "originalPrice", "discountedPrice", "image", "tag", "isAvailable")
VALUES
  (gen_random_uuid()::text, 'Walnut Desk Organizer',         'Solid walnut wood, hand-finished with natural oils.',                           10500,  8500, 'https://images.pexels.com/photos/5490336/pexels-photo-5490336.jpeg?auto=compress&cs=tinysrgb&w=800', 'Bestseller',   true),
  (gen_random_uuid()::text, 'Premium End-Grain Chopping Block', 'Professional grade end-grain oak, perfect for culinary experts.',            18000, 14000, 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=800', 'Kitchen',      true),
  (gen_random_uuid()::text, 'Minimalist Laptop Stand',        'Ergonomic elevation crafted from sustainable ash wood.',                        9500,  7500, 'https://images.pexels.com/photos/389818/pexels-photo-389818.jpeg?auto=compress&cs=tinysrgb&w=800',   'Office',       true),
  (gen_random_uuid()::text, 'Artisan Spice Rack',             'Magnetic locking system for seamless kitchen organization.',                   12000,  9500, 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=800', 'New Arrival',  true),
  (gen_random_uuid()::text, 'Wooden Catchall Tray',           'Sleek geometric design for keys, wallets, and EDC.',                            5500,  4500, 'https://images.pexels.com/photos/6686455/pexels-photo-6686455.jpeg?auto=compress&cs=tinysrgb&w=800', 'Everyday',     true),
  (gen_random_uuid()::text, 'Ergonomic Monitor Riser',        'Elevate your screen and organize your desk beautifully.',                      14000, 11000, 'https://images.pexels.com/photos/5095304/pexels-photo-5095304.jpeg?auto=compress&cs=tinysrgb&w=800', 'Workspace',    true)
ON CONFLICT DO NOTHING;

-- Done! ✅
SELECT 'AL GHAZI schema created and seeded successfully.' AS status;
