# Mystère CMS setup

1. Create a Supabase project.
2. Run `supabase/migrations/20260917000000_mystere_cms.sql` in the SQL Editor.
3. In Authentication → Users, create an admin user with email `thanglqce160451@fpt.edu.vn` and a password you choose. Keep email confirmation disabled for the first login, or confirm the address.
4. Copy the project URL and anon key to `.env` using `.env.example`.
5. Run `npm run dev` and open `/#/admin`.

The CMS editor uses Supabase Auth. Published project/event rows are public; draft rows and all edits require an authenticated user. The browser still falls back to localStorage when the environment variables are absent.
