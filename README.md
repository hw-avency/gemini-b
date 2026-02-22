<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This repository contains a Vite + React app and is preconfigured for deployment on **Google Cloud Run**.

## Run locally

**Prerequisites:** Node.js 20+

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Build locally

```bash
npm run build
npm run start
```

The production server listens on `PORT` (default `8080`) and serves the built `dist/` output.

## Deploy to Google Cloud Run

### Option A: Directly from source (recommended)

```bash
gcloud run deploy gemini-b \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated
```

Cloud Run will build the included `Dockerfile` and run the container on port `8080`.

### Option B: Build and deploy container image manually

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/gemini-b

gcloud run deploy gemini-b \
  --image gcr.io/PROJECT_ID/gemini-b \
  --region europe-west1 \
  --allow-unauthenticated
```
