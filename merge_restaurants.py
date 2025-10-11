from __future__ import annotations
import re
from pathlib import Path
from typing import Dict, List, Optional

import pandas as pd

# Requirements:
#   pip install pandas openpyxl

# Normalized output columns
OUT_COLUMNS = [
    "RestaurantName",
    "Category",
    "ItemName",
    "Price",
    "Size / Variant",
    "AdditionalInfo",
]

# Column synonym map: normalized target -> list of possible column name variants
SYNONYMS: Dict[str, List[str]] = {
    "Category": [
        "category",
        "type",
        "segment",
        "menu category",
        "group",
        "section",
    ],
    "ItemName": [
        "item",
        "item name",
        "product",
        "product name",
        "menu item",
        "dish",
        "name",
        "pizza",
        "burger",
    ],
    "Price": [
        "price",
        "rate",
        "amount",
        "cost",
        "mrp",
        "rs",
        "rupees",
    ],
    "Size / Variant": [
        "size",
        "variant",
        "portion",
        "crust",
        "topping",
        "weight",
        "ml",
        "pack",
        "medium/large",
    ],
    "AdditionalInfo": [
        "description",
        "notes",
        "detail",
        "details",
        "info",
        "remarks",
    ],
}

RESTAURANT_NAME_MAP = {
    "mcdonalds": "McDonald's",
    "pizza_hut": "Pizza Hut",
    "pizzahut": "Pizza Hut",
    "dominos": "Domino's",
    "burger_king": "Burger King",
    "burgerking": "Burger King",
}

BASE_DIR = Path(__file__).parent

INPUT_FILES = [
    BASE_DIR / "McDonalds_Price_Comparison_2025.xlsx",
    BASE_DIR / "pizza_hut_price_comparison.xlsx",
    BASE_DIR / "dominos_price_comparison.xlsx",
    # Burger King may be xlsx or csv; we will detect below
]

# Detect Burger King file dynamically
for ext in (".xlsx", ".csv"):
    candidate = BASE_DIR / f"burger_king_price_comparison{ext}"
    if candidate.exists():
        INPUT_FILES.append(candidate)
        break

OUTPUT_XLSX = BASE_DIR / "restaurants.xlsx"
OUTPUT_CSV = BASE_DIR / "restaurants_merged.csv"


def _normalize_col(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip().lower())


def _find_best_match(columns: List[str], targets: List[str]) -> Optional[str]:
    norm_cols = {c: _normalize_col(c) for c in columns}
    for t in targets:
        t_norm = _normalize_col(t)
        # Exact match first
        for c, n in norm_cols.items():
            if n == t_norm:
                return c
        # Startswith/contains fallback
        for c, n in norm_cols.items():
            if n.startswith(t_norm) or t_norm in n:
                return c
    return None


def _map_columns(df: pd.DataFrame) -> pd.DataFrame:
    if df is None or df.empty:
        return pd.DataFrame(columns=OUT_COLUMNS)

    df = df.copy()
    df.columns = [str(c) for c in df.columns]

    # Build detected mapping
    mapping: Dict[str, Optional[str]] = {}
    for target, variants in SYNONYMS.items():
        src = _find_best_match(list(df.columns), variants)
        mapping[target] = src

    # Construct normalized frame
    out = pd.DataFrame()
    out["Category"] = df[mapping["Category"]] if mapping["Category"] in df else None
    out["ItemName"] = df[mapping["ItemName"]] if mapping["ItemName"] in df else None
    out["Price"] = df[mapping["Price"]] if mapping["Price"] in df else None
    out["Size / Variant"] = (
        df[mapping["Size / Variant"]] if mapping["Size / Variant"] in df else None
    )
    out["AdditionalInfo"] = (
        df[mapping["AdditionalInfo"]] if mapping["AdditionalInfo"] in df else None
    )

    return out


def _clean_frame(df: pd.DataFrame, restaurant_name: str) -> pd.DataFrame:
    if df is None or df.empty:
        return pd.DataFrame(columns=OUT_COLUMNS)

    df = df.copy()

    # Trim whitespace in string-like columns
    for col in ["Category", "ItemName", "Size / Variant", "AdditionalInfo"]:
        if col in df:
            df[col] = df[col].astype(str).where(df[col].notna(), None)
            df[col] = df[col].apply(lambda x: x.strip() if isinstance(x, str) else x)
            # Replace empty strings with None
            df[col] = df[col].apply(lambda x: None if isinstance(x, str) and x == "" else x)

    # Normalize price: strip currency symbols and commas; coerce to float
    if "Price" in df:
        def to_price(val):
            if pd.isna(val):
                return pd.NA
            s = str(val)
            s = s.replace(",", "")
            s = re.sub(r"[^0-9.]+", "", s)
            try:
                return float(s) if s else pd.NA
            except Exception:
                return pd.NA
        df["Price"] = df["Price"].apply(to_price)

    # Add RestaurantName and re-order
    df["RestaurantName"] = restaurant_name
    df = df[[
        "RestaurantName",
        "Category",
        "ItemName",
        "Price",
        "Size / Variant",
        "AdditionalInfo",
    ]]

    # Drop fully empty rows for key columns
    df = df.dropna(how="all", subset=["ItemName", "Price", "Category", "Size / Variant"])

    # Remove duplicates
    df = df.drop_duplicates(subset=[
        "RestaurantName",
        "Category",
        "ItemName",
        "Size / Variant",
        "Price",
    ])

    return df


def _restaurant_from_path(path: Path) -> str:
    stem = path.stem.lower()
    for key, name in RESTAURANT_NAME_MAP.items():
        if key in stem:
            return name
    # Fallback to title-case of filename
    return stem.replace("_", " ").title()


def _load_all() -> Dict[str, List[pd.DataFrame]]:
    per_restaurant: Dict[str, List[pd.DataFrame]] = {}
    for path in INPUT_FILES:
        if not path.exists():
            print(f"Warning: file not found: {path}")
            continue
        rname = _restaurant_from_path(path)
        frames: List[pd.DataFrame] = []
        if path.suffix.lower() == ".csv":
            try:
                df = pd.read_csv(path)
                frames.append(df)
            except Exception as e:
                print(f"Failed reading CSV {path}: {e}")
        else:
            try:
                sheets = pd.read_excel(path, sheet_name=None)
                for _, df in sheets.items():
                    frames.append(df)
            except Exception as e:
                print(f"Failed reading Excel {path}: {e}")
        if frames:
            per_restaurant.setdefault(rname, []).extend(frames)
    return per_restaurant


def main() -> None:
    per_restaurant_raw = _load_all()

    per_restaurant_clean: Dict[str, pd.DataFrame] = {}
    merged_frames: List[pd.DataFrame] = []

    for rname, frames in per_restaurant_raw.items():
        normalized_dfs = [_map_columns(df) for df in frames]
        if not normalized_dfs:
            continue
        combined = pd.concat(normalized_dfs, ignore_index=True)
        cleaned = _clean_frame(combined, rname)
        if cleaned is None or cleaned.empty:
            continue
        per_restaurant_clean[rname] = cleaned
        merged_frames.append(cleaned)

    if not merged_frames:
        print("No data loaded. Please verify input files.")
        return

    merged_all = pd.concat(merged_frames, ignore_index=True)

    # Export CSV (database-ready)
    merged_all.to_csv(OUTPUT_CSV, index=False)
    print(f"Wrote CSV: {OUTPUT_CSV}")

    # Export Excel with one sheet per restaurant
    with pd.ExcelWriter(OUTPUT_XLSX, engine="openpyxl") as writer:
        for rname, df in per_restaurant_clean.items():
            # Excel sheet names max length 31, remove invalid chars
            sheet = re.sub(r"[\\/*?:\[\]]", " ", rname)[:31]
            df.to_excel(writer, sheet_name=sheet, index=False)
    print(f"Wrote Excel: {OUTPUT_XLSX}")


if __name__ == "__main__":
    main()
