import { promises as fs } from "fs";
import path from "path";

export type DataFileName =
  | "tours"
  | "packages"
  | "promos"
  | "availability"
  | "partners"
  | "bookings"
  | "crm-leads"
  | "fx"
  | "fx-settings"
  | "channels"
  | "channel-logs"
  | "staff"
  | "assignments"
  | "contact-messages";

const DATA_DIR = path.join(process.cwd(), "data");

function getFilePath(file: DataFileName) {
  return path.join(DATA_DIR, `${file}.json`);
}

export async function readJson<T>(file: DataFileName): Promise<T> {
  const filePath = getFilePath(file);
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content) as T;
}

export async function writeJson<T>(
  file: DataFileName,
  data: T
): Promise<void> {
  const filePath = getFilePath(file);
  await fs.mkdir(DATA_DIR, { recursive: true });
  const serialised = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, serialised, "utf-8");
}
