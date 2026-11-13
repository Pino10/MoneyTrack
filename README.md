# MoneyTrack

A private, open source money tracker that runs in the browser and installs like an app on iPhone, Android and laptops. No account, no server: all data stays on your device.

- Live app: https://pino10.github.io/MoneyTrack/
- iPhone: open in Safari, tap Share, then Add to Home Screen.
- Android: open in Chrome, tap the menu, then Install app.

## Features
- Daily spending profiles with wallets, budgets, categories, goals, debts, subscriptions and recurring entries.
- Savings records profiles for tracking deposits and growth.
- Insights, monthly report, achievements and a guided setup.
- Light and dark themes with a Liquid Glass style.
- Backup and restore as a file, auto-save to a file, CSV import and export, optional PIN lock.

## Privacy
Everything is stored in your browser on your device. Your records are never stored in this repository.

## Develop
The app lives in `web/`: plain HTML, CSS and JavaScript, no build step.
```
cd web
python3 -m http.server 8000
```
Pushes to `main` that change `web/` are published to GitHub Pages by `.github/workflows/pages.yml`.

## Licence
MIT.
