import { readJson, writeJson } from "./store";

export type TourCategory = "Sea" | "Culture" | "Nature" | "Signature Combo";

export interface Tour {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  location: string;
  durationHours: number;
  basePrice: number;
  images: string[];
  highlights: string[];
  included: string[];
  notIncluded: string[];
  whatToBring: string[];
  pickupTime: string;
  category: TourCategory;
  privateOptionAvailable: boolean;
}

export async function getTours(): Promise<Tour[]> {
  return readJson<Tour[]>("tours");
}

export async function getAllTours(): Promise<Tour[]> {
  return getTours();
}

export async function getTourBySlug(
  slug: string
): Promise<Tour | undefined> {
  const tours = await getTours();
  return tours.find((tour) => tour.slug === slug);
}

export async function saveTours(tours: Tour[]): Promise<void> {
  await writeJson<Tour[]>("tours", tours);
}
