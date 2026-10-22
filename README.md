# Cloud Dev Mastery (IT7101 Cloud Developing midterm)

One-page study site: 531 questions from M03 S3, M04 IAM, M05 DynamoDB, M06 API Gateway,
M07 Lambda and M08 Containers (Elastic Beanstalk not included), plus a study sheet per module.

## Files
- `index.html`: the whole app (design, questions, study sheets and code in one file)
- `firebase-config.js`: Firebase project settings (adeeb-640e7) for sign-in and sync
- `questions.json`: a readable copy of the question bank (the site does not need it)
- `.nojekyll`: tells GitHub Pages to serve the files as they are

## Put it on GitHub Pages
Upload these files to the root of the repository (replace the old `index.html`; the old `css/` and `js/`
folders are no longer used and can be deleted). Pages serves it from the main branch as before.

## Sign-in and sync
Sign-in is optional. Without it, progress is saved in that browser. Signed in (Google or email),
progress, flags and unfinished quizzes are stored in Firestore at `users/{uid}` as `{ blob, updatedAt }`,
so you can stop on one device and press Continue on another.

Firebase console checklist:
- Authentication → Sign-in method: Google and Email/Password enabled
- Authentication → Settings → Authorized domains: your `github.io` domain
- Firestore rules:
  ```
  match /users/{uid} { allow read, write: if request.auth != null && request.auth.uid == uid; }
  ```
