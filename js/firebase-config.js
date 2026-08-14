// Public Firebase project config (not a secret — see Firebase docs).
// Real access control lives in Firebase Auth settings and Firestore/Storage security rules.
export const firebaseConfig = {
  apiKey: "AIzaSyDAuYVp7POezwRtHutESvMZ-2BfWAADEv0",
  authDomain: "parlaenglish-app.firebaseapp.com",
  projectId: "parlaenglish-app",
  storageBucket: "parlaenglish-app.firebasestorage.app",
  messagingSenderId: "508560648798",
  appId: "1:508560648798:web:60a83ca7841b4336a1a2cf"
};

// reCAPTCHA v3 site key for Firebase App Check (Monitor mode).
// TODO: replace with the real site key after registering it in Google Cloud Console
// and linking it under Firebase Console -> App Check -> Web app -> reCAPTCHA v3.
export const recaptchaV3SiteKey = "REPLACE_WITH_RECAPTCHA_V3_SITE_KEY";
