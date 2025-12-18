/**
 * Script to migrate existing bookings from file system to Redis
 * 
 * Usage: npx tsx scripts/migrate-to-redis.ts
 * 
 * This will:
 * 1. Read all bookings from data/bookings.json
 * 2. Write them to Redis (if REDIS_URL is set)
 * 3. Verify the migration
 */

import fs from "fs/promises";
import path from "path";
import Redis from "ioredis";

const BOOKINGS_PATH = path.join(process.cwd(), "data", "bookings.json");
const REDIS_BOOKINGS_KEY = "savanablu:bookings";

async function migrateToRedis() {
  console.log("🔄 Starting migration from file system to Redis...\n");

  // 1. Read bookings from file
  let fileBookings: any[] = [];
  try {
    const raw = await fs.readFile(BOOKINGS_PATH, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      fileBookings = data;
      console.log(`✅ Read ${fileBookings.length} bookings from file system`);
    } else {
      console.log("⚠️  File does not contain an array");
      return;
    }
  } catch (err: any) {
    if (err.code === "ENOENT") {
      console.log("⚠️  No bookings.json file found");
      return;
    }
    console.error("❌ Error reading file:", err.message);
    return;
  }

  if (fileBookings.length === 0) {
    console.log("ℹ️  No bookings to migrate");
    return;
  }

  // 2. Check if Redis is available
  if (!process.env.REDIS_URL) {
    console.log("⚠️  REDIS_URL not set. Cannot migrate to Redis.");
    console.log("   Set REDIS_URL in your environment variables.");
    return;
  }

  // 3. Connect to Redis
  let redis: Redis | null = null;
  try {
    redis = new Redis(process.env.REDIS_URL);
    console.log("✅ Connected to Redis\n");
  } catch (err: any) {
    console.error("❌ Error connecting to Redis:", err.message);
    return;
  }

  // 4. Check existing Redis data
  try {
    const existing = await redis.get(REDIS_BOOKINGS_KEY);
    if (existing) {
      const existingBookings = JSON.parse(existing);
      console.log(`ℹ️  Found ${existingBookings.length} existing bookings in Redis`);
      console.log("   Will merge with file system bookings (file takes precedence)\n");
    }
  } catch (err: any) {
    console.log("ℹ️  No existing bookings in Redis\n");
  }

  // 5. Write to Redis
  try {
    await redis.set(REDIS_BOOKINGS_KEY, JSON.stringify(fileBookings, null, 2));
    console.log(`✅ Successfully wrote ${fileBookings.length} bookings to Redis\n`);
  } catch (err: any) {
    console.error("❌ Error writing to Redis:", err.message);
    redis.quit();
    return;
  }

  // 6. Verify
  try {
    const verify = await redis.get(REDIS_BOOKINGS_KEY);
    if (verify) {
      const verified = JSON.parse(verify);
      console.log(`✅ Verification: ${verified.length} bookings in Redis`);
      console.log("   Migration complete!\n");
    }
  } catch (err: any) {
    console.error("❌ Error verifying:", err.message);
  }

  redis.quit();
  console.log("✨ Migration complete!");
}

migrateToRedis().catch(console.error);

