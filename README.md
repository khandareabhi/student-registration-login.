# Student Registration and Login (Supabase)

## 1. Configure Supabase
1. Open your Supabase project.
2. Go to SQL Editor → New query.
3. Paste `database.sql` and click Run.
4. Open Project Settings → API Keys.
5. Copy the Project URL and the **publishable key** (or legacy `anon` public key).

## 2. Add keys
Open `config.js` and replace:
- `YOUR_SUPABASE_PROJECT_URL`
- `YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY`

Never put a `service_role` or secret key in browser-side JavaScript.

## 3. Run locally
Open a terminal in this folder and run:

```bash
python -m http.server 5500
```

Then visit http://localhost:5500

## 4. Test
1. Register with a name, email and password (minimum 8 characters).
2. If email confirmation is enabled, confirm the email using the message Supabase sends.
3. Log in with the same email and password.
4. Check Supabase → Table Editor → profiles.

## Notes
- The app uses Supabase Auth for password handling; it does not store plain-text passwords.
- The `profiles` table is populated automatically by a database trigger after a new Auth user is created.
- For password reset, add your local URL (for example `http://localhost:5500`) to Supabase Authentication → URL Configuration → Redirect URLs.
"# student-registration-login." 
