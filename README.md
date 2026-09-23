# Appcues Mobile Test App

A React Native iOS app for testing Appcues Mobile SDK features. Install it on your personal iPhone to test flows, events, embeds, screen tracking, deep links, etc without needing a customer environment.

Some expectations here: 
1. Push notifications cannot be tested unless you set up your own Apple Developer license
2. Any time Xcode has an update, you will need to reinstall the app manually
---

## What the app does

| Screen | Purpose |
|---|---|
| **Login** | Identify a user with custom properties and group |
| **Home** | Navigate to all screens, fire events, open debugger |
| **Profile** | Update user and group properties, add custom properties |
| **Events** | Fire preset or custom events |
| **Explore** | Secondary screen for testing screen-based flows |
| **Embeds** | Test Appcues embedded content (3 frame slots) |
| **Settings** | Switch to a different Appcues account for testing |

---

## Requirements

Before you start, make sure you have:

- A **Mac** (required for iOS development)
- **Xcode** installed — [download from the Mac App Store](https://apps.apple.com/us/app/xcode/id497799835)
- **Node.js** (v22 or later) — [download here](https://nodejs.org)
- **Brew** installed on your computer (which you should have if you've set up the web version of your demo app)
- **CocoaPods** — install by running `brew install cocoapods` in Terminal
- An **iPhone** with a USB cable
- Your **Appcues Account ID** and **Application ID** — find these in Appcues Studio under Settings → Apps & Installation

---

## Setup

### 1. Clone the repo

Open Claude and use this prompt:

```
I need you to clone this Git repo (https://github.com/belangerc1/Appcues-Mobile-Demo-App.git) and place it in my documents in a new folder titled appcues-mobile-app-demo
```
This will create a folder in your Documents with all the necessary files.

### 2. Edit your personal config

> **⚠️ Don't skip this step.** The app won't connect to your Appcues account until you fill in your credentials.

Open `src/config.ts` in any text editor (VS Code works great) and replace the placeholder values with your own:

```ts
// Your Appcues credentials — find these in Studio → Settings → Apps & Installation
export const APPCUES_ACCOUNT_ID = 'YOUR_ACCOUNT_ID';       // e.g. '101304'
export const APPCUES_APPLICATION_ID = 'YOUR_APPLICATION_ID'; // e.g. 'dc0aca0e-...'

// Your default test user — shown pre-filled on the Login screen
export const DEFAULT_USER = {
  userId: 'your-test-user',   // any unique ID you want to test with
  email: 'you@appcues.com',
  role: 'Support Specialist',
  company: 'Appcues',
  plan: 'growth',
  industry: 'SaaS',
  language: 'en',
};
```

### 3. Install dependencies

Right click on your project folder (apcues-mobile-app-demo) and select **New Terminal At Folder**. Run the following command.

```
npm install
```

Then install the iOS native dependencies by navigating in the terminal to your ios folder and running this commanad  :

```
cd ios && pod install && cd ..
```

### 4. Open in Xcode

Open the file `ios/AppcuesTestApp.xcworkspace` in Xcode.

> Make sure to open the `.xcworkspace` file, not `.xcodeproj` — otherwise the app won't build correctly.

### 5. Set your signing team

In Xcode:
1. Click **AppcuesTestApp** in the left sidebar under TARGETS
2. Go to the **Signing & Capabilities** tab
3. Under **Team**, select your personal Apple ID or click "add a new account" and sign in with your Apple ID if it's your first time.
4. If you see a signing error, click **Try Again** or **Register Device**

### 6. Run the app on your iPhone

1. Connect your iPhone via USB
2. Select your iPhone from the device dropdown at the top of Xcode
3. Hit the **Play** button
4. The first time, your iPhone may ask you to trust the developer — go to **Settings → General → VPN & Device Management** on your phone and trust your Apple ID

---

## Running after initial setup

Once set up, you don't need to rebuild in Xcode every time. Just:

1. Open Terminal and run `npm start` in the project folder
2. Open the app on your phone

Changes to screen files will hot-reload automatically. You only need to rebuild in Xcode if you install new native dependencies.

---

## Switching to a different Appcues account

To test inside a customer's account, tap the **⚙️ Settings** icon on the Home screen. Enter their Account ID and Application ID — the Settings screen will walk you through the steps.

> **Note:** The Appcues Debugger QR code and screen capture in Studio only work with your own Application ID, since it's registered in the app's iOS configuration. These features won't work when using a different account's credentials.

---

## Embed frame IDs

The Embeds screen has 3 pre-configured frame slots:

| Frame | ID to use in Studio |
|---|---|
| Frame 1 | `frame-1` |
| Frame 2 | `frame-2` |
| Frame 3 | `frame-3` |

When creating an embed in Studio, set its Frame ID to match one of the above and set targeting to Screen = `"Embeds"`.

---

## Deep links

Navigate directly to any screen from Appcues Studio using these URLs in the deep link field:

| Screen | Deep link URL |
|---|---|
| Home | `appcuestestapp://screen/home` |
| Profile | `appcuestestapp://screen/profile` |
| Events | `appcuestestapp://screen/events` |
| Explore | `appcuestestapp://screen/explore` |
| Embeds | `appcuestestapp://screen/embeds` |

---

## Troubleshooting

**App says "no longer available" on my phone**
You built for a different target (e.g. Mac). Select your iPhone in Xcode and rebuild.

**Pod install fails with a Unicode error**
Run `LANG=en_US.UTF-8 pod install` instead from the `ios` folder.

**Signing error in Xcode**
Make sure you're signed into Xcode with your Apple ID under Xcode → Settings → Accounts.

**App builds but crashes immediately**
Try a clean build: In Xcode go to Product → Clean Build Folder (Cmd+Shift+K), then hit Play again.
