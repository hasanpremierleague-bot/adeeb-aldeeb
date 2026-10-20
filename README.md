# Cloud Dev Quiz

A static study and quiz site for the IT7101 midterm: AWS Academy Cloud Developing Modules 3–8, using the official slide ranges (M03 7–34, M04 6–43, M05 7–63, M06 7–87, M07 7–65, M08 6–49). Code slides are excluded.

- A study sheet for every lesson.
- A quiz for every lesson. The lesson quizzes cover every concept in the slides together. Questions are multiple choice, true/false, matching and drag & drop, with no code questions.
- A **Final exam** that mixes all lessons. You can pick 10, 20, 30, 60 or all questions, and it is graded at the end.
- An **Important & probable questions** panel with high-yield questions from every lesson.
- **Review my mistakes**, which collects every question you answered wrong until you get it right.
- Practice mode shows the answer after each question. Exam mode shows the answers at the end.
- Scores are saved, and the site has dark mode and works on phones.
- Firebase login with email/password, Google and password reset.

## Host it on GitHub Pages

1. Create a new GitHub repository, for example `cloud-quiz`.
2. Upload **everything inside this folder** (`index.html`, `css/`, `js/`, `.nojekyll`, `README.md`) to the root of the repo.
3. Go to **Settings → Pages**. Under "Build and deployment" choose **Deploy from a branch**, pick `main` and `/ (root)`, then click Save.
4. After a minute the site is live at `https://<your-username>.github.io/cloud-quiz/`.

Until you set up Firebase, the site runs in **guest mode**. Everything works, and progress is saved in your browser.

## Turn on Firebase login

1. Open https://console.firebase.google.com and create a project.
2. Go to **Project settings → General → Your apps** and add a **Web app**. Copy the `firebaseConfig` values.
3. Paste those values into `js/firebase-config.js`, replacing the `YOUR_...` placeholders.
4. Go to **Build → Authentication → Get started → Sign-in method** and enable **Email/Password**. Enable **Google** too if you want the Google button.
5. Go to **Authentication → Settings → Authorized domains** and add `<your-username>.github.io`.
6. Optional: to sync scores across devices, create a **Firestore Database** and set `syncProgressToFirestore: true` in `js/firebase-config.js`. Then use rules that let each user read and write only their own document:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

The Firebase web config is safe to commit because it is not a secret. Access is controlled by Authentication and the Firestore rules.

Settings in `js/firebase-config.js`:

| Setting | Meaning |
|---|---|
| `requireLogin` | When `true`, users must sign in to use the site (only after Firebase is configured). |
| `enableGoogleSignIn` | Shows the "Continue with Google" button. |
| `syncProgressToFirestore` | Also saves progress to Firestore under `users/{uid}`. |

## Run it locally

Open `index.html` directly in a browser. Firebase login needs the site to be served over http, so you can also run:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Edit questions

The questions and study sheets live in `js/data/m3.js` … `m8.js`. Each question uses one of these formats:

```
{ t: 'mcq',   i: 1, c: 'Topic', q: 'Question?', o: ['Correct answer first', 'Wrong', 'Wrong', 'Wrong'], e: 'Explanation' }
{ t: 'tf',          c: 'Topic', q: 'Statement.', a: true, e: 'Explanation' }
{ t: 'match', i: 1, c: 'Topic', q: 'Match…', p: [['Left', 'Right'], ['Left', 'Right']], e: 'Explanation' }
{ t: 'dnd',         c: 'Topic', q: 'Drag each…', p: [['Item', 'Box'], ['Item', 'Box']], e: 'Explanation' }
{ t: 'order',       c: 'Topic', q: 'Put in order…', s: ['First', 'Second', 'Third'], e: 'Explanation' }
```

Fields:

- In multiple-choice questions, the correct option is always listed first. The site shuffles the options when it shows them.
- `i: 1` puts the question in the Important panel.
