import fs from "fs/promises";
import path from "path";

const AVAILABILITY_PATH = path.join(
  process.cwd(),
  "data",
  "availability.json"
);

export type AvailabilityData = {
  globalBlocked: string[]; // e.g. ["2025-12-25"]
  tours: Record<string, string[]>; // { "safari-blue": ["2025-12-31"] }
};

async function ensureShape(raw: any): Promise<AvailabilityData> {
  const data: AvailabilityData = {
    globalBlocked: Array.isArray(raw?.globalBlocked)
      ? raw.globalBlocked
      : [],
    tours: typeof raw?.tours === "object" && raw?.tours !== null
      ? raw.tours
      : {},
  };

  // Normalise values to string[]
  data.globalBlocked = data.globalBlocked.filter(
    (d: any) => typeof d === "string"
  );
  for (const key of Object.keys(data.tours)) {
    if (!Array.isArray(data.tours[key])) {
      data.tours[key] = [];
    } else {
      data.tours[key] = data.tours[key].filter(
        (d: any) => typeof d === "string"
      );
    }
  }

  return data;
}

export async function readAvailability(): Promise<AvailabilityData> {
  try {
    const raw = await fs.readFile(AVAILABILITY_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return ensureShape(parsed);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      // File does not exist yet – start with empty structure
      return {
        globalBlocked: [],
        tours: {},
      };
    }
    throw err;
  }
}

export async function writeAvailability(data: AvailabilityData) {
  const normalised = await ensureShape(data);
  await fs.writeFile(
    AVAILABILITY_PATH,
    JSON.stringify(normalised, null, 2),
    "utf8"
  );
}

export async function getBlockedDatesForTour(
  tourSlug: string
): Promise<string[]> {
  const data = await readAvailability();

  const global = data.globalBlocked || [];

  const perTour = data.tours?.[tourSlug] || [];

  // Deduplicate
  const all = [...global, ...perTour];

  return Array.from(new Set(all));
}
