# MoneyTrack

A free, open source money tracker for iPhone. It is built around one habit: pay yourself first.
Everything stays on your phone. There are no accounts and no servers.

## What it does
- **Vault:** a liquid orb that fills as you save toward a goal you set.
- **Pay yourself first:** when income arrives, slide how much to set aside and move it to your Vault.
- **Wallets:** bank accounts, cards, mobile money, cash at hand and savings vaults, each with its own currency and optional pockets.
- **Smart add:** type a note and it fills in the category, wallet and amount from your past entries.
- **Insights and story mode:** animated charts, plus a story that walks through your month.
- **Clean categories:** names use letters and numbers only, each with a short code such as `FD`.
- **Light and dark** themes. Uses Liquid Glass on iOS 26 and frosted material on iOS 17 and 18.
- **CSV import and export.** It reads the export format of the Android "Wallet" style app (Date, Type, Category, Amount, Currency, Memo, Wallet) and maps old categories to the cleaner ones.

## Get the app (no Mac needed)
1. Create a new public repository on GitHub and push this folder to the `main` branch.
2. Open the **Actions** tab. The **Build IPA** workflow runs automatically (about 5 minutes).
3. Open the finished run and download the **MoneyTrack-ipa** artifact. Unzip it to get `MoneyTrack.ipa`.
4. To share it, create a **Release** on GitHub. The workflow attaches `MoneyTrack.ipa` to it.

## Install on an iPhone
The IPA is unsigned, so it must be signed with your own Apple ID when you install it:
- **Sideloadly** (Mac or Windows): plug in the phone, drag in the IPA, sign in with your Apple ID.
- **AltStore or SideStore:** add the IPA and it refreshes itself every week.
- **Xcode on a Mac:** run `xcodegen generate`, open `MoneyTrack.xcodeproj`, choose your phone and press Run.

With a free Apple ID the app must be refreshed every 7 days. A paid developer account lasts a year.
After installing, go to Settings, General, VPN and Device Management and trust your developer profile.
Turn on Developer Mode (Settings, Privacy and Security) if iOS asks.

## Load your records
Open the app, tap the gear on Today, then **Import a CSV file**. Duplicates are skipped, so importing twice is safe.
Your data never goes in this repository.

## Build it yourself
```
brew install xcodegen
xcodegen generate
open MoneyTrack.xcodeproj
```
Needs Xcode 15 or newer. The app targets iOS 17.

## Licence
MIT.
