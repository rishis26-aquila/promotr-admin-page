import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, "..", "..", "dummydata.csv");
const fallbackPath = path.join(process.cwd(), "Server", "dummydata.csv");
const vercelPath = path.join(process.cwd(), "dummydata.csv");

let allData: any[] = [];
let csvHeaders: string[] = [];

export function parseCSV(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim() !== "");
  if (lines.length === 0) return [];

  const firstLine = lines[0] || "";
  csvHeaders = firstLine.split(",").map((h) => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const currentline = lines[i]?.split(",");
    if (!currentline || currentline.length < csvHeaders.length) continue;

    const obj: any = {};
    for (let j = 0; j < csvHeaders.length; j++) {
      const header = csvHeaders[j];
      const val = currentline[j];
      if (!header || val === undefined) continue;

      let cleanVal = val.trim();
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
    if (fs.existsSync(csvPath)) {
      allData = parseCSV(csvPath);
      console.log(`✅ Loaded ${allData.length} records from CSV at ${csvPath}`);
    } else if (fs.existsSync(fallbackPath)) {
      allData = parseCSV(fallbackPath);
      console.log(`✅ Loaded ${allData.length} records from CSV at fallback path ${fallbackPath}`);
    } else if (fs.existsSync(vercelPath)) {
      allData = parseCSV(vercelPath);
      console.log(`✅ Loaded ${allData.length} records from CSV at Vercel path ${vercelPath}`);
    } else {
      console.error(`❌ CSV file not found at ${csvPath}, ${fallbackPath}, or ${vercelPath}`);
    }
  } catch (error) {
    console.error("❌ Error loading CSV:", error);
  }
}

export function saveData() {
  try {
    if (csvHeaders.length === 0) {
      console.error("❌ Cannot save CSV: Headers not loaded");
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
          // Fix CSV Injection by escaping formulas
          if (/^[=+\-@\t\r]/.test(val)) {
            val = "'" + val;
          }
          if (val.includes(",")) val = `"${val}"`;
          return val;
        })
        .join(",");
    });

    const csvContent = [headerLine, ...lines].join("\n");

    if (fs.existsSync(csvPath)) {
      fs.writeFileSync(csvPath, csvContent, "utf-8");
    } else if (fs.existsSync(fallbackPath)) {
      fs.writeFileSync(fallbackPath, csvContent, "utf-8");
    } else {
      fs.writeFileSync(vercelPath, csvContent, "utf-8");
    }
    console.log(`✅ Saved ${allData.length} records to CSV`);
  } catch (error) {
    console.error("❌ Error stringifying/saving CSV:", error);
  }
}

export function getData() {
  return allData;
}

export function setData(newData: any[]) {
  allData = newData;
}
