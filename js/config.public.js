// Public config committed to git.
// Firebase client config is safe to expose — security enforced by Firestore Rules.
// CLAUDE_API_KEY is NOT stored here — injected at deploy time by GitHub Actions.
// For local development, js/config.js (gitignored) overrides this entire object.
var CONFIG = {
  CLAUDE_API_KEY: null,

  FIREBASE: {
    apiKey:            'AIzaSyCGkeAKUdHmtc-I_b77X891T8fNEsXlXdk',
    authDomain:        'crew-bee76.firebaseapp.com',
    projectId:         'crew-bee76',
    storageBucket:     'crew-bee76.firebasestorage.app',
    messagingSenderId: '289757697523',
    appId:             '1:289757697523:web:c85d6396e078ba6bb5ae86',
    measurementId:     'G-ZNW76WERHY'
  }
};
