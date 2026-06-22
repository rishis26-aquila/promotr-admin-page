import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multiple candidate paths for the CSV file.
// The order matters: most specific first, broadest last.
const CSV_CANDIDATES = [
  path.join(__dirname, "..", "..", "dummydata.csv"), // Local dev: Server/dummydata.csv relative to src/utils/
  path.join(process.cwd(), "Server", "dummydata.csv"), // Local dev: from project root
  path.join(process.cwd(), "dummydata.csv"), // Vercel: bundled at function root
  path.join(__dirname, "..", "dummydata.csv"), // Vercel: bundled relative to src/
  path.join(__dirname, "dummydata.csv"), // Vercel: bundled in same dir
];

function findCsvPath(): string | null {
  for (const candidate of CSV_CANDIDATES) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

let allData: any[] = [];
let csvHeaders: string[] = [];
let resolvedCsvPath: string | null = null;

function parseCsvLine(text: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export function parseCSV(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim() !== "");
  if (lines.length === 0) return [];

  const firstLine = lines[0] || "";
  csvHeaders = parseCsvLine(firstLine).map((h) => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i]) continue;
    const currentline = parseCsvLine(lines[i] as string);
    if (currentline.length < csvHeaders.length) continue;

    const obj: any = {};
    for (let j = 0; j < csvHeaders.length; j++) {
      const header = csvHeaders[j];
      const val = currentline[j];
      if (!header || val === undefined) continue;

      let cleanVal = val.trim();
      // Quotes are already stripped by the parsing logic if we wanted,
      // but let's strip them here if they still exist at boundaries
      if (cleanVal.startsWith('"') && cleanVal.endsWith('"')) {
        cleanVal = cleanVal.substring(1, cleanVal.length - 1);
      }
      obj[header] = cleanVal;
    }
    data.push(obj);
  }
  return data;
}

export function loadData() {
  try {
    resolvedCsvPath = findCsvPath();
    if (resolvedCsvPath) {
      allData = parseCSV(resolvedCsvPath);
      console.log(`Loaded ${allData.length} records from ${resolvedCsvPath}`);
    } else {
      console.error(
        `CSV file not found. Searched paths: ${CSV_CANDIDATES.join(", ")}`,
      );
    }
  } catch (error) {
    console.error("Error loading CSV:", error);
  }
}

export function saveData() {
  try {
    if (csvHeaders.length === 0) {
      console.error("Cannot save CSV: Headers not loaded");
      return;
    }

    const headerLine = csvHeaders.join(",");
    const lines = allData.map((obj) => {
      return csvHeaders
        .map((header) => {
          let val =
            obj[header] !== undefined && obj[header] !== null
              ? obj[header].toString()
              : "";
          // Prevent CSV injection by escaping formula characters
          if (/^[=+\-@\t\r]/.test(val)) {
            val = "'" + val;
          }
          if (val.includes(",")) val = `"${val}"`;
          return val;
        })
        .join(",");
    });

    const csvContent = [headerLine, ...lines].join("\n");

    const writePath = resolvedCsvPath || CSV_CANDIDATES[0]!;
    fs.writeFileSync(writePath, csvContent, "utf-8");
    console.log(`Saved ${allData.length} records to ${writePath}`);
  } catch (error) {
    console.error("Error saving CSV:", error);
  }
}

export function getData() {
  return allData;
}

export function setData(newData: any[]) {
  allData = newData;
}
