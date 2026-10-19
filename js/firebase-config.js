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
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

window.AUTH_SETTINGS = {
  requireLogin: true,             // when Firebase is configured, users must sign in to use the site
  enableGoogleSignIn: true,       // show the "Continue with Google" button
  syncProgressToFirestore: false  // also save progress to Firestore (users/{uid}) – needs Firestore enabled
};
