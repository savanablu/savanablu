# Vercel KV Setup for Bookings Storage

To ensure all bookings are captured on the admin panel (especially on Vercel's read-only filesystem), we're using Vercel KV (Redis) for persistent storage.

## Setup Steps

1. **Create a Vercel KV Database:**
   - Go to your Vercel dashboard
   - Navigate to your project
   - Go to the "Storage" tab
   - Click "Create Database"
   - Select "KV" (Redis)
   - Choose a name (e.g., "savanablu-bookings")
   - Select a region close to your users

2. **Add Environment Variables:**
   - In your Vercel project settings, go to "Environment Variables"
   - The KV database credentials are automatically added as:
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
   - These should already be available after creating the KV database

3. **Deploy:**
   - Push your changes to trigger a new deployment
   - The system will automatically use KV for storage on Vercel

## How It Works

- **Local Development:** Uses file system (`data/bookings.json`)
- **Vercel Production:** Uses Vercel KV (Redis) for persistent storage
- **Fallback:** If KV is not available, it falls back to file system (with warnings)

## Migration

Existing bookings in `data/bookings.json` will be automatically read and can be migrated to KV. The system reads from both sources and prioritizes KV when available.

## Testing

After setup, create a test booking and verify it appears in the admin panel. Check Vercel function logs to see:
- `[Bookings] Saved X bookings to Vercel KV` - confirms KV is working
- `[Bookings] Read X bookings from Vercel KV` - confirms reads are working

