// ─────────────────────────────────────────────────────────────
// Appcues Test App — Configuration
//
// Edit this file with your own details before running the app.
// Each person using this app should update these values.
// ─────────────────────────────────────────────────────────────

// Storage keys for persisting credentials across app restarts
export const STORAGE_KEY_ACCOUNT_ID = 'appcues_account_id';
export const STORAGE_KEY_APP_ID = 'appcues_application_id';

// Your Appcues credentials
// Find these in Appcues Studio → Settings → Apps & Installation
export const APPCUES_ACCOUNT_ID = 'YOUR_ACCOUNT_ID';
export const APPCUES_APPLICATION_ID = 'YOUR_APPLICATION_ID';

// Default user shown on the Login screen
// Change these to match your own test persona
export const DEFAULT_USER = {
  userId: 'your-test-user',
  email: 'you@appcues.com',
  role: 'Support Specialist',
  company: 'Appcues',
  plan: 'growth',
  industry: 'SaaS',
  language: 'en',
};

// Default group shown on the Login screen
export const DEFAULT_GROUP = {
  groupId: 'appcues-test-org',
  groupName: 'Appcues Test Org',
  groupPlan: 'enterprise',
  groupSeats: '50',
  groupRegion: 'US',
  groupMrr: '5000',
  groupOnboardingComplete: true,
};
