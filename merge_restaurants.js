/*
  Requirements:
    npm install xlsx

  Usage:
    node "merge_restaurants.js"
*/

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const BASE_DIR = __dirname;

const OUT_COLUMNS = [
  'RestaurantName',
  'Category',
  'ItemName',
  'Price',
  'Size / Variant',
  'AdditionalInfo',
];

const SYNONYMS = {
  Category: [
    'category',
    'type',
    'segment',
    'menu category',
    'group',
    'section',
  ],
  ItemName: [
    'item',
    'item name',
    'product',
    'product name',
    'menu item',
    'dish',
    'name',
    'pizza',
    'burger',
  ],
  Price: [
    'price',
    'rate',
    'amount',
    'cost',
    'mrp',
    'rs',
    'rupees',
  ],
  'Size / Variant': [
    'size',
    'variant',
    'portion',
    'crust',
    'topping',
    'weight',
    'ml',
    'pack',
    'medium/large',
  ],
  AdditionalInfo: [
    'description',
    'notes',
    'detail',
    'details',
    'info',
    'remarks',
  ],
};

const RESTAURANT_NAME_MAP = new Map([
  ['mcdonalds', "McDonald's"],
  ['pizza_hut', 'Pizza Hut'],
  ['pizzahut', 'Pizza Hut'],
  ['dominos', "Domino's"],
  ['burger_king', 'Burger King'],
  ['burgerking', 'Burger King'],
]);

const INPUT_FILES = [
  path.join(BASE_DIR, 'McDonalds_Price_Comparison_2025.xlsx'),
  path.join(BASE_DIR, 'pizza_hut_price_comparison.xlsx'),
  path.join(BASE_DIR, 'dominos_price_comparison.xlsx'),
];
// Detect Burger King file dynamically (.xlsx or .csv)
(() => {
  for (const ext of ['.xlsx', '.csv']) {
    const candidate = path.join(BASE_DIR, `burger_king_price_comparison${ext}`);
    if (fs.existsSync(candidate)) {
      INPUT_FILES.push(candidate);
      break;
    }
  }
})();

const OUTPUT_XLSX = path.join(BASE_DIR, 'restaurants.xlsx');
const OUTPUT_CSV = path.join(BASE_DIR, 'restaurants_merged.csv');

function _norm(s) {
  return String(s).trim().toLowerCase().replace(/\s+/g, ' ');
}

function _findBestMatch(columns, targets) {
  const normCols = new Map(columns.map((c) => [c, _norm(c)]));
  for (const t of targets) {
    const tNorm = _norm(t);
    // exact
    for (const [c, n] of normCols.entries()) {
      if (n === tNorm) return c;
    }
    // startswith / contains
    for (const [c, n] of normCols.entries()) {
      if (n.startsWith(tNorm) || n.includes(tNorm)) return c;
    }
  }
  return null;
}

function _mapColumns(rows) {
  if (!rows || rows.length === 0) return [];
  const columns = Object.keys(rows[0] || {});
  const mapping = {};
  for (const [target, variants] of Object.entries(SYNONYMS)) {
    mapping[target] = _findBestMatch(columns, variants);
  }
  return rows.map((r) => ({
    Category: mapping['Category'] ? r[mapping['Category']] : null,
    ItemName: mapping['ItemName'] ? r[mapping['ItemName']] : null,
    Price: mapping['Price'] ? r[mapping['Price']] : null,
    'Size / Variant': mapping['Size / Variant'] ? r[mapping['Size / Variant']] : null,
    AdditionalInfo: mapping['AdditionalInfo'] ? r[mapping['AdditionalInfo']] : null,
  }));
}

function _toPrice(val) {
  if (val === undefined || val === null || val === '') return null;
  let s = String(val);
  s = s.replace(/,/g, '');
  s = s.replace(/[^0-9.]+/g, '');
  if (!s) return null;
  const num = Number(s);
  return Number.isFinite(num) ? num : null;
}

function _cleanRows(rows, restaurantName) {
  const cleaned = [];
  for (const row of rows) {
    const obj = { ...row };
    for (const key of ['Category', 'ItemName', 'Size / Variant', 'AdditionalInfo']) {
      const v = obj[key];
      if (v === undefined || v === null) {
        obj[key] = null;
      } else if (typeof v === 'string') {
        const trimmed = v.trim();
        obj[key] = trimmed.length ? trimmed : null;
      } else {
        obj[key] = v;
      }
    }
    obj.Price = _toPrice(obj.Price);
    obj.RestaurantName = restaurantName;
    cleaned.push({
      RestaurantName: obj.RestaurantName,
      Category: obj.Category ?? null,
      ItemName: obj.ItemName ?? null,
      Price: obj.Price ?? null,
      'Size / Variant': obj['Size / Variant'] ?? null,
      AdditionalInfo: obj.AdditionalInfo ?? null,
    });
  }
  // Drop fully empty rows for key columns
  const filtered = cleaned.filter((r) => {
    return (
      (r.ItemName && r.ItemName !== '') ||
      (r.Price !== null && r.Price !== undefined) ||
      (r.Category && r.Category !== '') ||
      (r['Size / Variant'] && r['Size / Variant'] !== '')
    );
  });

  // Remove duplicates (composite key)
  const seen = new Set();
  const unique = [];
  for (const r of filtered) {
    const key = [
      r.RestaurantName ?? '',
      r.Category ?? '',
      r.ItemName ?? '',
      r['Size / Variant'] ?? '',
      r.Price ?? ''
    ].join('|\u241F|');
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(r);
    }
  }
  return unique;
}

function _restaurantFromPath(p) {
  const stem = path.basename(p, path.extname(p)).toLowerCase();
  for (const [key, val] of RESTAURANT_NAME_MAP.entries()) {
    if (stem.includes(key)) return val;
  }
  return stem.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

function _readAll() {
  const perRestaurant = new Map();
  for (const file of INPUT_FILES) {
    if (!fs.existsSync(file)) {
      console.warn(`Warning: file not found: ${file}`);
      continue;
    }
    const rname = _restaurantFromPath(file);
    const ext = path.extname(file).toLowerCase();
    const frames = [];

    try {
      const wb = XLSX.readFile(file, { cellDates: false, raw: false });
      const sheetNames = wb.SheetNames;
      for (const s of sheetNames) {
        const ws = wb.Sheets[s];
        const json = XLSX.utils.sheet_to_json(ws, { defval: null });
        frames.push(json);
      }
    } catch (err) {
      console.error(`Failed reading ${file}:`, err.message);
    }

    if (frames.length) {
      if (!perRestaurant.has(rname)) perRestaurant.set(rname, []);
      perRestaurant.get(rname).push(...frames);
    }
  }
  return perRestaurant;
}

function writeExcel(perRestaurantClean) {
  const wb = XLSX.utils.book_new();
  for (const [rname, rows] of perRestaurantClean.entries()) {
    const aoa = [OUT_COLUMNS];
    for (const r of rows) {
      aoa.push([
        r.RestaurantName,
        r.Category,
        r.ItemName,
        r.Price,
        r['Size / Variant'],
        r.AdditionalInfo,
      ]);
    }
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const sheetName = rname.replace(/[\\/*?:\[\]]/g, ' ').slice(0, 31) || 'Sheet';
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  }
  XLSX.writeFile(wb, OUTPUT_XLSX);
  console.log(`Wrote Excel: ${OUTPUT_XLSX}`);
}

function writeCsv(mergedAll) {
  const wb = XLSX.utils.book_new();
  const aoa = [OUT_COLUMNS];
  for (const r of mergedAll) {
    aoa.push([
      r.RestaurantName,
      r.Category,
      r.ItemName,
      r.Price,
      r['Size / Variant'],
      r.AdditionalInfo,
    ]);
  }
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  XLSX.utils.book_append_sheet(wb, ws, 'All');
  const csv = XLSX.utils.sheet_to_csv(ws);
  fs.writeFileSync(OUTPUT_CSV, csv, 'utf8');
  console.log(`Wrote CSV: ${OUTPUT_CSV}`);
}

function main() {
  const perRestaurantRaw = _readAll();
  const perRestaurantClean = new Map();
  const mergedAll = [];

  for (const [rname, frames] of perRestaurantRaw.entries()) {
    const mapped = frames.map((rows) => _mapColumns(rows));
    const flat = mapped.flat();
    if (!flat.length) continue;
    const cleaned = _cleanRows(flat, rname);
    if (!cleaned.length) continue;
    perRestaurantClean.set(rname, cleaned);
    mergedAll.push(...cleaned);
  }

  if (!mergedAll.length) {
    console.log('No data loaded. Please verify input files.');
    return;
  }

  writeCsv(mergedAll);
  writeExcel(perRestaurantClean);
}

if (require.main === module) {
  main();
}
