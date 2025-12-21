// scripts/clear-all-bookings.ts
// Script to clear all booking data (test data cleanup)

import { writeBookings } from "@/lib/data/bookings";
import fs from "fs/promises";
import path from "path";

const BOOKINGS_PATH = path.join(process.cwd(), "data", "bookings.json");

async function clearAllBookings() {
  try {
    console.log("🗑️  Clearing all booking data...");

    // Clear bookings using the writeBookings function (handles both Redis and file system)
    await writeBookings([]);
    
    console.log("✅ All bookings cleared successfully!");
    console.log("   - Redis storage cleared (if available)");
    console.log("   - File system storage cleared");
    
    // Verify by checking file
    try {
      const fileData = await fs.readFile(BOOKINGS_PATH, "utf-8");
      const bookings = JSON.parse(fileData);
      if (Array.isArray(bookings) && bookings.length === 0) {
        console.log("   ✓ Verified: bookings.json is now empty");
      } else {
        console.log(`   ⚠️  Warning: bookings.json still has ${bookings.length} entries`);
      }
    } catch (err: any) {
      if (err.code === "ENOENT") {
        console.log("   ✓ Verified: bookings.json does not exist (empty)");
      } else {
        console.log("   ⚠️  Could not verify file:", err.message);
      }
    }

    console.log("\n✨ All booking data has been cleared!");
  } catch (error: any) {
    console.error("❌ Error clearing bookings:", error.message);
    process.exit(1);
  }
}

// Run the script
clearAllBookings()
  .then(() => {
    console.log("\n✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });

