# Passionate Living Website Migration Tracker

This is a React application to track the progress of the website migration project.

## Project Setup

The project was initialized with Vite and React.

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1.  Clone the repository (if applicable) or navigate to the project directory.
2.  Install dependencies:

    ```bash
    npm install
    ```

## Running Locally

To start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

## Building for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

### Vercel

1.  Install Vercel CLI: `npm i -g vercel`
2.  Run `vercel` in the project root and follow the prompts.
3.  Or, connect your GitHub repository to Vercel dashboard and it will automatically detect the Vite project.

### Netlify

1.  Drag and drop the `dist/` folder to Netlify Drop.
2.  Or, connect your GitHub repository to Netlify. The build command is `npm run build` and the publish directory is `dist`.
