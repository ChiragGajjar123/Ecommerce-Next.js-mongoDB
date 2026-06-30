# CMG Ecommerce

Full-stack ecommerce app built inside Next.js with MongoDB, Tailwind CSS, server components, and server actions. There is no separate backend service; data reads and mutations run on the Next.js server side.

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` from `.env.example`.
3. Start MongoDB locally at `mongodb://localhost:27017/`.
4. Seed demo data and an admin:
   ```bash
   npm run seed
   ```
5. Start the app:
   ```bash
   npm run dev
   ```

Demo admin: `admin@cmg.local` / `Admin@12345`

Demo customer: `customer@cmg.local` / `Customer@12345`

## Required Environment Variables

- `MONGODB_URI`: MongoDB connection string. Use MongoDB Atlas for Vercel.
- `MONGODB_DB`: database name, defaults to `cmg_ecommerce`.
- `SESSION_SECRET`: at least 32 random characters for signed auth sessions.
- `RESEND_API_KEY`: enables real forgot-password email delivery.
- `RESEND_FROM`: verified sender in Resend.
- `APP_URL`: public URL used in password reset emails when request headers are unavailable.

## Vercel Deployment

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Add the environment variables above in Vercel Project Settings.
4. Use MongoDB Atlas or another reachable MongoDB URI; `localhost` cannot be reached from Vercel.
5. Deploy. The app uses Next.js server actions and MongoDB directly from the Vercel server runtime.

Forgot password uses Resend with a two-minute resend interval, a 30-minute token expiry, and password confirmation before update.
