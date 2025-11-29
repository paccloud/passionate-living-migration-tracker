# Passionate Living Website Migration Tracker

A real-time project tracking application for the Passionate Living website migration from Avada to a custom WordPress Block Theme.

🔗 **Live Demo**: [Coming Soon]  
📂 **Repository**: https://github.com/paccloud/passionate-living-migration-tracker

## Features

- ✅ Real-time milestone tracking with status indicators
- 💰 Billing and payment tracking
- 💬 Discussion & updates section with role-based comments
- 📸 Image upload support for updates
- 📊 Visual progress indicators
- ⚡ Fully editable interface for both vendor and client

## Tech Stack

- **Frontend**: React + Vite
- **Database**: Neon PostgreSQL
- **Deployment**: Vercel/Netlify
- **Styling**: Vanilla CSS with Google Fonts (Pacifico, Montserrat, Open Sans)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm
- A Neon database account

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/paccloud/passionate-living-migration-tracker.git
   cd passionate-living-migration-tracker
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Neon database connection string:

   ```
   DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require
   ```

4. **Set up the database**:

   - Log in to your [Neon Console](https://console.neon.tech/)
   - Create a new database or use an existing one
   - Run the SQL script from `database/schema.sql` in the Neon SQL Editor

5. **Run locally**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):

   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```
3. **Add environment variables** in the Vercel dashboard:
   - Go to your project settings
   - Add `DATABASE_URL` with your Neon connection string

### Deploy to Netlify

1. **Build the project**:

   ```bash
   npm run build
   ```

2. **Deploy**:
   - Drag and drop the `dist/` folder to [Netlify Drop](https://app.netlify.com/drop)
   - Or connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variable `DATABASE_URL`

## Project Structure

```
├── api/                 # Serverless API functions
├── database/           # Database schema and migrations
├── src/
│   ├── App.jsx         # Main app component
│   ├── MigrationTracker.jsx  # Main tracker component
│   └── index.css       # Global styles
├── public/             # Static assets
└── package.json
```

## Environment Variables

| Variable       | Description                             |
| -------------- | --------------------------------------- |
| `DATABASE_URL` | Neon PostgreSQL connection string       |
| `VITE_API_URL` | API base URL (optional, for production) |

## Contributing

This is a private client project. For questions or support, please contact Ryan.

## License

Proprietary - All rights reserved
