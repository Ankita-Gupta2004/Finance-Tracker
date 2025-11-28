# FinTrack

FinTrack is a personal finance tracker web application built using the MERN stack (React, Node.js/Express.js, MongoDB) with Firebase authentication. It enables users to efficiently manage their finances by recording income and expenses, visualizing spending patterns through interactive charts, setting financial goals and budgets, and utilizing advanced financial calculators such as FIRE, FD, RD, and SIP calculators.

The app provides users with actionable insights into their financial health and includes a SIP Optimizer feature to evaluate whether they are investing the right amount in the right instruments. Per-user data storage and client-side AES encryption ensure quick UI responses and robust data privacy. All financial data is securely stored locally on the user’s device, with no data transmitted to external servers, giving users full control over their information.

## Key features

- Firebase Authentication (protected routes)
- Expense & income forms with multiple categories (essential, discretionary, investments, loans, etc.)
- Dashboard with totals (Income, Expense, Savings), charts and goal progress with financial healt card.
- Calculators: FIRE, FD, RD, SIP.
- SIP optimizer (based on risk factor - age).
- Per-user local caching for fast rendering (optionally AES-encrypted)
- Responsive UI using Tailwind CSS


## Tech stack

- Frontend: React, Vite
- Styling: Tailwind CSS
- Authentication: Firebase Auth 
- DataBase: MongoDB
- Storage: localStorage (per-user keys), CryptoJS for AES encryption
- Routing: react-router
- Deployment: Firebase hosting(frontend), Render(backend)

## Project structure (important folders)

- frontend/src/Auth — Login / CreateAccount / Reset flows
- frontend/src/componenets/Dashboard — Dashboard UI and panels
- frontend/src/componenets/Expense — Expense form pages and sections
- frontend/src/componenets/Homepage — Homepage and calculators
- frontend/src/routes — PrivateRoute, route guards
- frontend/src/Firebase (or /firebase) — Firebase initialisation

## Local development (Windows)

1. Install dependencies
   npm install

2. Create environment file at frontend/.env or project root (used by Vite). Required vars:
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_SECRET_KEY=your_client_side_secret_key

3. Start dev server
   npm run dev

4. Build for production
   npm run build

## Firebase notes

- Enable Firebase Authentication (Email/Password or providers you use).
- If you use Firestore, set rules to limit access:
  rules_version = '2';
  service cloud.firestore {
  match /databases/{database}/documents {
  match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
  }
  }
  }
- Ensure firebase is initialized before mounting routes (import firebase in main index).

## LocalStorage keys (used by app)

- financeData\_{uid} — encrypted JSON of user's finance form (ExpensePage saves this)
- lastModified\_{uid} — ISO timestamp (or encrypted) of last save
- account\_{uid} — account summary (name, email, totals, budget)
  Notes: Dashboard reads per-user keys (falls back to generic keys while developing). If encryption is used, SECRET_KEY must match between saving and reading.

## Security & privacy

- Client-side SECRET_KEY is not a replacement for server-side security. Use Firestore security rules and, for sensitive operations, server-side storage/encryption.
- Avoid placing real secrets in client-side env for production.

## Common troubleshooting

- If dashboard shows zeros: check DevTools → Application → Local Storage for financeData*{yourUid} and lastModified*{yourUid}. Ensure entries exist and numeric fields are stored as numbers or numeric strings.
- If protected routes show a spinner: ensure Firebase is initialized early and PrivateRoute prefers auth.currentUser or an AuthProvider cache to avoid unnecessary waits.

## Testing & debugging

- Use browser DevTools console logs added in Dashboard/ExpensePage to inspect parsing, raw values, and encryption issues.
- Verify date parsing and numeric parsing (strip commas/currency symbols).

## Contribution

- Fork, create a feature branch, implement changes, open a PR. Keep changes modular (separate components, small commits).

## Contact

- Author: Ankita Gupta
- Project: FinTrack
