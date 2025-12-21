// scripts/force-clear-bookings.ts
// Force clear all booking data from both Redis and file system

import fs from "fs/promises";
import path from "path";

const BOOKINGS_PATH = path.join(process.cwd(), "data", "bookings.json");
const REDIS_BOOKINGS_KEY = "savanablu:bookings";

async function forceClearAllBookings() {
  try {
    console.log("🗑️  Force clearing all booking data...");

    // 1. Clear file system
    try {
      await fs.writeFile(BOOKINGS_PATH, "[]", "utf-8");
      console.log("✅ Cleared bookings.json file");
    } catch (err: any) {
      console.error("❌ Error clearing file:", err.message);
    }

    // 2. Clear Redis if available
    try {
      const Redis = (await import("ioredis")).default;
      if (process.env.REDIS_URL) {
        const redis = new Redis(process.env.REDIS_URL);
        await redis.del(REDIS_BOOKINGS_KEY);
        console.log("✅ Cleared Redis storage");
        await redis.quit();
      } else {
        console.log("ℹ️  REDIS_URL not set, skipping Redis clear");
      }
    } catch (err: any) {
      console.warn("⚠️  Could not clear Redis:", err.message);
    }

    // 3. Verify file is empty
    try {
      const fileData = await fs.readFile(BOOKINGS_PATH, "utf-8");
      const bookings = JSON.parse(fileData);
      if (Array.isArray(bookings) && bookings.length === 0) {
        console.log("✅ Verified: bookings.json is empty");
      } else {
        console.log(`⚠️  Warning: bookings.json has ${bookings.length} entries`);
        // Force write empty array
        await fs.writeFile(BOOKINGS_PATH, "[]", "utf-8");
        console.log("✅ Force cleared bookings.json again");
      }
    } catch (err: any) {
      console.error("❌ Error verifying file:", err.message);
    }

    console.log("\n✨ All booking data has been force cleared!");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

// Run the script
forceClearAllBookings()
  .then(() => {
    console.log("\n✅ Script completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });

