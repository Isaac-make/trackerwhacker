# Trackerwhacker

A private money tracker (profits, spending, savings, S&P 500 & gold with forecast, progress), published with GitHub Pages.

- All money data is encrypted in the browser with the user's own password before it's saved here. This repo never holds readable numbers.
- `prices.json` is refreshed from Yahoo Finance every 30 minutes on weekdays by `.github/workflows/prices.yml`. Add tickers to `tickers.json`.
