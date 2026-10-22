// Firebase Auth wrapper. Loads the Firebase SDK only when js/firebase-config.js is filled in,
// so the site also works as plain static files (guest mode) before you configure it.
(function () {
  const SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
  const cfg = window.FIREBASE_CONFIG || {};
  const settings = Object.assign({ requireLogin: true, enableGoogleSignIn: true, syncProgressToFirestore: false }, window.AUTH_SETTINGS || {});
  const configured = !!cfg.apiKey && !/^YOUR_/.test(cfg.apiKey);

  let fb = null; // { auth, authMod, db, fsMod }

  async function load() {
    if (fb) return fb;
    const appMod = await import(SDK + 'firebase-app.js');
    const authMod = await import(SDK + 'firebase-auth.js');
    const app = appMod.initializeApp(cfg);
    const auth = authMod.getAuth(app);
    fb = { auth, authMod };
    if (settings.syncProgressToFirestore) {
      const fsMod = await import(SDK + 'firebase-firestore.js');
      fb.fsMod = fsMod;
      fb.db = fsMod.getFirestore(app);
    }
    return fb;
  }

  function friendly(err) {
    const code = (err && err.code) || '';
    const map = {
      'auth/invalid-email': 'That email address looks invalid.',
      'auth/missing-password': 'Please enter your password.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
      'auth/invalid-credential': 'Wrong email or password.',
      'auth/wrong-password': 'Wrong email or password.',
      'auth/user-not-found': 'No account found with that email.',
      'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
      'auth/popup-closed-by-user': 'Google sign-in was closed before finishing.',
      'auth/unauthorized-domain': 'This domain is not authorized in Firebase. Add it under Authentication → Settings → Authorized domains.',
      'auth/operation-not-allowed': 'This sign-in method is not enabled in the Firebase console.'
    };
    return map[code] || (err && err.message) || 'Something went wrong.';
  }

  window.Auth = {
    configured,
    settings,
    friendly,
    async init(onChange) {
      if (!configured) { onChange(null); return; }
      try {
        const { auth, authMod } = await load();
        authMod.onAuthStateChanged(auth, (user) => onChange(user));
      } catch (e) {
        console.error('Firebase failed to load', e);
        window.Auth.loadError = e;
        onChange(null);
      }
    },
    async signIn(email, password) {
      const { auth, authMod } = await load();
      return authMod.signInWithEmailAndPassword(auth, email, password);
    },
    async signUp(email, password, name) {
      const { auth, authMod } = await load();
      const cred = await authMod.createUserWithEmailAndPassword(auth, email, password);
      if (name) await authMod.updateProfile(cred.user, { displayName: name });
      return cred;
    },
    async google() {
      const { auth, authMod } = await load();
      return authMod.signInWithPopup(auth, new authMod.GoogleAuthProvider());
    },
    async reset(email) {
      const { auth, authMod } = await load();
      return authMod.sendPasswordResetEmail(auth, email);
    },
    async signOut() {
      const { auth, authMod } = await load();
      return authMod.signOut(auth);
    },
    // Optional Firestore progress sync. Progress is stored as a JSON string because Firestore
    // does not allow nested arrays (saved quiz answers contain them).
    async loadRemote(uid) {
      if (!configured || !settings.syncProgressToFirestore) return null;
      const { db, fsMod } = await load();
      const snap = await fsMod.getDoc(fsMod.doc(db, 'users', uid));
      if (!snap.exists()) return null;
      const d = snap.data();
      if (d.progressJson) { try { return JSON.parse(d.progressJson); } catch (e) { return null; } }
      return d.progress || null;
    },
    async saveRemote(uid, progress) {
      if (!configured || !settings.syncProgressToFirestore) return;
      const { db, fsMod } = await load();
      await fsMod.setDoc(fsMod.doc(db, 'users', uid), { progressJson: JSON.stringify(progress), updatedAt: Date.now() });
    }
  };
})();
