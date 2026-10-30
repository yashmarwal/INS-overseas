// "Export products": one spreadsheet-ready CSV of the whole catalogue (opens in Excel, Google Sheets, Numbers).
export type CsvProduct = {
  code: string;
  name: string;
  category: string;
  description: string;
  moq: number | null; // empty in the file = "confirmed in quote"
  lead: number;
  size: string;
  material: string;
  colours: string;
  custom: string;
  label: string;
  onHomepage: boolean;
  photo: string;
  morePhotos: string[];
  page: string;
  id: string;
};

export const CSV_HEADER = [
  "Item code", "Name", "Category", "Description", "Minimum order (pcs)", "Lead time (days)", "Size", "Material", "Colours",
  "Customisation", "Label", "On homepage", "Photo link", "More photo links", "Product page", "Product ID",
];

/** One cell: quoted when it needs to be, and defused if a spreadsheet might read it as a formula (a cell starting with = + - @). */
export const csvCell = (v: unknown) => {
  let s = String(v ?? "").replace(/\r\n|\r/g, "\n");
  if (/^[=+\-@\t]/.test(s) && !/^-?\d+(\.\d+)?$/.test(s)) s = `'${s}`;
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function buildProductsCsv(rows: CsvProduct[]): string {
  const lines = [CSV_HEADER.map(csvCell).join(",")];
  for (const r of rows) {
    lines.push([
      r.code, r.name, r.category, r.description, r.moq ?? "", r.lead, r.size, r.material, r.colours, r.custom, r.label,
      r.onHomepage ? "Yes" : "No", r.photo, r.morePhotos.join(" "), r.page, r.id,
    ].map(csvCell).join(","));
  }
  return "﻿" + lines.join("\r\n") + "\r\n"; // (the BOM makes Excel read the accents and symbols correctly)
}

export function downloadCsv(text: string, filename: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
