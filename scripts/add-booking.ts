/**
 * Script to manually add a booking to bookings.json
 * 
 * Usage: npx tsx scripts/add-booking.ts
 * 
 * Edit the booking object below with Tabassum's details, then run the script.
 */

import fs from "fs/promises";
import path from "path";

const BOOKINGS_PATH = path.join(process.cwd(), "data", "bookings.json");

// 🔹 EDIT THIS BOOKING OBJECT WITH TABASSUM'S DETAILS FROM THE EMAIL
const newBooking = {
  id: `booking_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  type: "zanzibar-tour", // or "safari"
  experienceSlug: "jozani-forest-red-colobus-encounter", // Update with correct slug
  experienceTitle: "Jozani Forest & Red Colobus Encounter", // Update with correct title
  date: "2026-01-15", // Update with booking date (YYYY-MM-DD format)
  dateLabel: "15 Jan 2026", // Update with human-readable date
  adults: 1, // Update
  children: 0, // Update
  totalUSD: 57.6, // Update with total amount
  totalUsd: 57.6, // Same as totalUSD
  depositUSD: 0,
  balanceUSD: 57.6, // Same as totalUSD if no deposit paid
  promoCode: undefined, // or "SAVANA10" if used
  customerName: "Tabassum", // Update if different
  customerEmail: "tabassum@example.com", // Update with Tabassum's email
  customerPhone: "+255123456789", // Update with Tabassum's phone
  guestName: "Tabassum", // Same as customerName
  guestEmail: "tabassum@example.com", // Same as customerEmail
  guestPhone: "+255123456789", // Same as customerPhone
  notes: "Pick-up location: [UPDATE]\nPick-up time: [UPDATE]\nAirport pick-up required: [Yes/No]\nFlight details: [UPDATE or 'Not required']\n\nNumber of people: [UPDATE]\n\nGuest notes: [UPDATE]",
  status: "pending", // or "confirmed" if advance was paid
  createdAt: new Date().toISOString(), // Will use current time, or update with actual booking time
  source: "website-booking",
  pickupLocation: "[UPDATE]", // Extract from email
  pickupTime: "[UPDATE]", // Extract from email
  airportPickup: false, // Update based on email
  airportFlight: null, // Update if airport pickup
  // If advance was paid, add these:
  // paymentStatus: "confirmed",
  // confirmedAt: "[ISO date string]",
  // advancePayment: {
  //   method: "ziina",
  //   percent: 20,
  //   usd: 11.52, // 20% of total
  //   aed: 42.62, // Converted amount
  //   paidAt: "[ISO date string]"
  // }
};

async function addBooking() {
  try {
    console.log("📖 Reading bookings.json...");
    const raw = await fs.readFile(BOOKINGS_PATH, "utf-8");
    const bookings = JSON.parse(raw);

    if (!Array.isArray(bookings)) {
      console.error("❌ bookings.json is not an array");
      process.exit(1);
    }

    // Check if booking already exists
    const exists = bookings.some((b: any) => 
      b.id === newBooking.id || 
      (b.customerEmail === newBooking.customerEmail && 
       b.date === newBooking.date &&
       b.experienceTitle === newBooking.experienceTitle)
    );

    if (exists) {
      console.log("⚠️  A similar booking already exists. Skipping.");
      return;
    }

    console.log("📝 Adding booking:", {
      id: newBooking.id,
      name: newBooking.customerName,
      email: newBooking.customerEmail,
      date: newBooking.dateLabel,
      experience: newBooking.experienceTitle,
    });

    // Create backup
    const backupPath = `${BOOKINGS_PATH}.backup.${Date.now()}`;
    await fs.copyFile(BOOKINGS_PATH, backupPath);
    console.log(`💾 Backup created: ${backupPath}`);

    // Add booking
    bookings.push(newBooking);

    // Write updated bookings
    await fs.writeFile(
      BOOKINGS_PATH,
      JSON.stringify(bookings, null, 2),
      "utf-8"
    );

    console.log("✅ Booking added successfully!");
    console.log(`\n📋 Summary:`);
    console.log(`   - Booking ID: ${newBooking.id}`);
    console.log(`   - Guest: ${newBooking.customerName}`);
    console.log(`   - Date: ${newBooking.dateLabel}`);
    console.log(`   - Total bookings: ${bookings.length}`);

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

addBooking();




