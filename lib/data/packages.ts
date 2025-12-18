import fs from "fs/promises";
import path from "path";

const PACKAGES_PATH = path.join(process.cwd(), "data", "packages.json");

export type PackageDay = {
  title: string;
  description: string;
  overnight?: string;
};

export type Package = {
  slug: string;
  title: string;
  shortDescription: string;
  image: string;
  priceFrom: number;
  gallery?: string[];
  days: PackageDay[];
  includes: string[];
  excludes: string[];
};

async function readPackagesFile(): Promise<Package[]> {
  try {
    const raw = await fs.readFile(PACKAGES_PATH, "utf8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      return data as Package[];
    }
    return [];
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

export async function getPackages(): Promise<Package[]> {
  const packages = await readPackagesFile();
  // Sort by priceFrom ascending as a simple, logical order
  return [...packages].sort((a, b) => a.priceFrom - b.priceFrom);
}

export async function getAllPackages(): Promise<Package[]> {
  return getPackages();
}

export async function getPackageBySlug(
  slug: string
): Promise<Package | null> {
  const packages = await readPackagesFile();
  const pkg = packages.find((p) => p.slug === slug);
  return pkg ?? null;
}

export async function getPackageSlugs(): Promise<string[]> {
  const packages = await readPackagesFile();
  return packages.map((p) => p.slug);
}
