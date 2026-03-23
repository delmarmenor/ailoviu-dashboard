export default async function handler(req, res) {
  const url = "https://script.google.com/macros/s/AKfycbyFHG7Q1a9_KWtsjv03TozFx2OyXGtxCn76-MmCeMf_J8F7yYTgYENrfvqTm8bJNsE/exec?mode=data";
  try {
    const r1 = await fetch(url, { redirect: "manual" });
    const location = r1.headers.get("location");
    const finalUrl = location || url;
    const r2 = await fetch(finalUrl);
    const text = await r2.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(text);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
```

Guarda y:
```
cd E:\ailoviu-dashboard
git add .
git commit -m "fix redirect"
git push