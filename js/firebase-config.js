// =====================================================================
//  FIREBASE CONFIG  –  fill this in to turn on login
// =====================================================================
// 1. Go to https://console.firebase.google.com and create a project.
// 2. Project settings → General → "Your apps" → add a Web app (</>).
// 3. Copy the firebaseConfig values it shows you into the object below.
// 4. Build → Authentication → Get started → enable "Email/Password"
//    (and "Google" if you want the Google button).
// 5. Authentication → Settings → Authorized domains → add your GitHub
//    Pages domain, e.g.  yourname.github.io
// 6. (Optional) Build → Firestore Database → Create database, then set
//    syncProgressToFirestore: true below to save scores across devices.
//
// While apiKey still says "YOUR_API_KEY" the site runs in guest mode
// (everything works, progress is saved only in this browser).
// =====================================================================

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyB-SagCMoR8Ll56nmBDLI4ar4dW97I3nAk",
  authDomain: "adeeb-640e7.firebaseapp.com",
  projectId: "adeeb-640e7",
  storageBucket: "adeeb-640e7.firebasestorage.app",
  messagingSenderId: "510178375637",
  appId: "1:510178375637:web:74ef4c0b16f8e048a12f5c"
};

window.AUTH_SETTINGS = {
  requireLogin: true,             // when Firebase is configured, users must sign in to use the site
  enableGoogleSignIn: true,       // show the "Continue with Google" button
  syncProgressToFirestore: true   // also save progress to Firestore (users/{uid}) – needs Firestore enabled
};
