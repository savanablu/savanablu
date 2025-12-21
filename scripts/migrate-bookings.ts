/**
 * Migration script to backfill advancePayment for confirmed bookings
 * 
 * This script:
 * 1. Finds bookings with paymentStatus: "confirmed" that don't have advancePayment
 * 2. Calculates 20% advance from total
 * 3. Adds advancePayment structure
 * 4. Updates balanceUSD to be total - advancePaid
 * 
 * Run: npx tsx scripts/migrate-bookings.ts
 * Or: node --loader ts-node/esm scripts/migrate-bookings.ts
 */

import fs from "fs/promises";
import path from "path";

const BOOKINGS_PATH = path.join(process.cwd(), "data", "bookings.json");

function getTotalUsd(booking: any): number | null {
  if (typeof booking.totalUsd === "number") return booking.totalUsd;
  if (typeof booking.totalUSD === "number") return booking.totalUSD;
  if (typeof booking.total === "number") return booking.total;
  return null;
}

async function migrateBookings() {
  try {
    console.log("📖 Reading bookings.json...");
    const raw = await fs.readFile(BOOKINGS_PATH, "utf-8");
    const bookings = JSON.parse(raw);

    if (!Array.isArray(bookings)) {
      console.error("❌ bookings.json is not an array");
      process.exit(1);
    }

    console.log(`📊 Found ${bookings.length} bookings`);

    let updatedCount = 0;
    let skippedCount = 0;

    const updated = bookings.map((booking) => {
      // Only process confirmed bookings that don't have advancePayment
      const isConfirmed = 
        booking.paymentStatus === "confirmed" || 
        booking.status === "confirmed" ||
        booking.confirmedAt;

      if (!isConfirmed) {
        skippedCount++;
        return booking;
      }

      // Skip if already has advancePayment
      if (booking.advancePayment?.usd) {
        skippedCount++;
        return booking;
      }

      const total = getTotalUsd(booking);
      if (!total || total <= 0) {
        console.warn(`⚠️  Booking ${booking.id} has no valid total, skipping`);
        skippedCount++;
        return booking;
      }

      // Calculate 20% advance
      const advanceUsd = Math.round(total * 0.2 * 100) / 100;
      const balanceUsd = Math.round((total - advanceUsd) * 100) / 100;

      // Get confirmedAt date or use current date
      const confirmedAt = booking.confirmedAt || new Date().toISOString();

      console.log(`✅ Updating booking ${booking.id}:`);
      console.log(`   Total: USD ${total.toFixed(2)}`);
      console.log(`   Advance (20%): USD ${advanceUsd.toFixed(2)}`);
      console.log(`   Balance: USD ${balanceUsd.toFixed(2)}`);

      updatedCount++;

      return {
        ...booking,
        advancePayment: {
          method: "ziina",
          percent: 20,
          usd: advanceUsd,
          aed: null, // We don't have historical AED rates, so leave as null
          paidAt: confirmedAt,
        },
        balanceUSD: balanceUsd,
        balanceUsd: balanceUsd,
        depositUSD: advanceUsd,
        depositUsd: advanceUsd,
      };
    });

    if (updatedCount === 0) {
      console.log("✅ No bookings needed updating. All confirmed bookings already have advancePayment.");
      return;
    }

    console.log(`\n📝 Writing updated bookings.json...`);
    console.log(`   Updated: ${updatedCount} bookings`);
    console.log(`   Skipped: ${skippedCount} bookings`);

    // Create backup first
    const backupPath = `${BOOKINGS_PATH}.backup.${Date.now()}`;
    await fs.copyFile(BOOKINGS_PATH, backupPath);
    console.log(`💾 Backup created: ${backupPath}`);

    // Write updated bookings
    await fs.writeFile(
      BOOKINGS_PATH,
      JSON.stringify(updated, null, 2),
      "utf-8"
    );

    console.log("✅ Migration complete!");
    console.log(`\n📋 Summary:`);
    console.log(`   - Total bookings: ${bookings.length}`);
    console.log(`   - Updated: ${updatedCount}`);
    console.log(`   - Skipped: ${skippedCount}`);
    console.log(`   - Backup: ${backupPath}`);

  } catch (err: any) {
    if (err.code === "ENOENT") {
      console.error("❌ bookings.json not found");
    } else {
      console.error("❌ Error:", err.message);
      console.error(err);
    }
    process.exit(1);
  }
}

migrateBookings();

