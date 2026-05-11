// ===================================================================
// Config Example — Copy this file to 'config.js' and add your keys
// ===================================================================
// SETUP:
//   1. Copy this file, rename to 'config.js' (same folder)
//   2. Fill in CLAUDE_API_KEY  → https://console.anthropic.com
//   3. Fill in FIREBASE keys   → https://console.firebase.google.com
//      • Create project → Firestore Database → Start in test mode
//      • Project Settings → Your apps → Web app → Config object
//
// config.js is in .gitignore — it will never be uploaded to GitHub
// ===================================================================

const CONFIG = {
  CLAUDE_API_KEY: 'YOUR_API_KEY_HERE',

  // Firebase — enables cross-device profile persistence
  FIREBASE: {
    apiKey:            'YOUR_FIREBASE_API_KEY',
    authDomain:        'YOUR_PROJECT_ID.firebaseapp.com',
    projectId:         'YOUR_PROJECT_ID',
    storageBucket:     'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId:             'YOUR_APP_ID'
  }
};
