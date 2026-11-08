// Fetches the latest price for every ticker in tickers.json from Yahoo Finance
// and writes prices.json. Run by .github/workflows/prices.yml.
import fs from "node:fs";

const tickers = JSON.parse(fs.readFileSync("tickers.json", "utf8"));
let quotes = {};
try { quotes = JSON.parse(fs.readFileSync("prices.json", "utf8")).quotes || {}; } catch {}

for (const t of tickers) {
  const sym = String(t).trim().toUpperCase();
  if (!sym) continue;
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=1d&interval=1d`;
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const meta = (await r.json()).chart.result[0].meta;
    const pence = meta.currency === "GBp" || meta.currency === "GBX";
    quotes[sym] = {
      price: +(pence ? meta.regularMarketPrice / 100 : meta.regularMarketPrice).toFixed(4),
      raw: meta.regularMarketPrice,
      currency: meta.currency,
      time: new Date(meta.regularMarketTime * 1000).toISOString(),
      name: meta.longName || meta.shortName || sym
    };
    console.log(sym, quotes[sym].price);
  } catch (e) {
    console.error("Could not fetch", sym, e.message);
  }
}

fs.writeFileSync("prices.json", JSON.stringify({ updated: new Date().toISOString(), quotes }, null, 2) + "\n");
