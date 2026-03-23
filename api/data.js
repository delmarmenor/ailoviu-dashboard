export default async function handler(req, res) {
  const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTFnGpi3GGm5Xa3FwAyU8FjId8eNWxChOjD_YwaClkIDZjIx5xeUsgSldncNaXVpQ3P0Fl1tEFj7jcS/pub?gid=0&single=true&output=csv";
  try {
    const r = await fetch(csvUrl);
    const text = await r.text();
    const lines = text.split("\n").filter(l => l.trim());
    if (lines.length < 2) {
      res.status(200).json({ total: 0, headers: [], data: [] });
      return;
    }
    const headers = parseCSVLine(lines[0]);
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = parseCSVLine(lines[i]);
      const row = {};
      headers.forEach((h, j) => { row[h] = vals[j] || ""; });
      rows.push(row);
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "s-maxage=300");
    res.status(200).json({ total: rows.length, headers, data: rows });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') { current += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { current += c; }
    } else {
      if (c === '"') { inQuotes = true; }
      else if (c === ',') { result.push(current.trim()); current = ""; }
      else { current += c; }
    }
  }
  result.push(current.trim());
  return result;
}
```

