import fs from "fs/promises";
import path from "path";

const PROMOS_PATH = path.join(process.cwd(), "data", "promos.json");

export type PromoType = "percent" | "fixed";

export type Promo = {
  code: string;
  type: PromoType;
  value: number;
  active: boolean;
};

async function readPromosFile(): Promise<Promo[]> {
  try {
    const raw = await fs.readFile(PROMOS_PATH, "utf8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      return data as Promo[];
    }
    return [];
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

export async function getPromoByCode(code: string): Promise<Promo | null> {
  const promos = await readPromosFile();
  const upper = code.trim().toUpperCase();
  const promo = promos.find(
    (p) => p.code.trim().toUpperCase() === upper && p.active
  );
  return promo ?? null;
}

export async function findPromoByCode(code: string): Promise<Promo | null> {
  return getPromoByCode(code);
}

export async function getAllPromos(): Promise<Promo[]> {
  return readPromosFile();
}
