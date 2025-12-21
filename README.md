# Woothealth Web & Mobile App Development

**Woothealth** is a modern web and mobile application platform built with cutting-edge technologies to deliver health and wellness services.

## Overview

This repository contains the source code for the Woothealth web application, built with [Next.js](https://nextjs.org) and modern web technologies.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (React)
- **Styling**: Tailwind CSS
- **Language**: TypeScript / JavaScript
- **Package Manager**: npm / yarn / pnpm

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/woothhealth/Woothealth-Web-Mobile-App-Development.git
cd Woothealth-Web-Mobile-App-Development
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The app automatically updates as you edit files.

## Project Structure

```
app/
├── page.tsx          # Home page
├── layout.tsx        # Root layout
├── globals.css       # Global styles
└── Components/       # Reusable components
public/              # Static assets
styles/              # CSS files
```

## Forgot / Reset Password (Added)

This project now includes a "Forgot Password" flow (frontend + lightweight server helpers) implemented for demo purposes.

Features:
- A forgot password form at: `/auth/forgot-password` (email input only)
- Server API endpoints:
  - `POST /api/auth/forgot` — accepts { email } and creates a one-hour token and logs/sends a reset link
  - `POST /api/auth/reset` — accepts { token, password } to validate token and update the user's password
- Reset page: `/auth/reset-password/[token]` — set a new password and then you'll be redirected to login

Notes & setup:
- This uses a simple JSON file store in `data/users.json` and `data/passwordResetTokens.json` for demo/testing purposes. Replace with your database in production.
- To send real email, provide SMTP env variables in `.env`:
  - `EMAIL_SMTP_HOST`, `EMAIL_SMTP_PORT`, `EMAIL_SMTP_USER`, `EMAIL_SMTP_PASS`, `EMAIL_FROM`
- Example `.env.example` added.

How to test locally:
1. Install new dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Visit `/auth/forgot-password` and request a reset. If SMTP is not configured, the reset link will be printed in server logs.

Security notes:
- Tokens expire in 1 hour.
- Passwords are hashed with `bcryptjs` when reset.

If you want, I can wire this up to your real user database or add email templates and rate limiting next.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint


## License

© 2025 Woothealth. All rights reserved.

## Support

For issues and questions, please open an issue on GitHub.