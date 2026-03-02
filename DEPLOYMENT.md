# LMS Deployment Guide

## 🚀 Deployment to Render

This guide explains how to deploy the LMS to [Render](https://render.com).

### Prerequisites

1. A Render account
2. A MongoDB Atlas database (free tier available)
3. GitHub repository connected to Render

---

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IPs (`0.0.0.0/0`) for Render access
5. Get your connection string: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/lms`

---

## Step 2: Deploy Services on Render

### Option A: Using Blueprint (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Blueprint**
3. Connect your GitHub repo
4. Render will read `render.yaml` and create both services
5. Configure environment variables in each service

### Option B: Manual Setup

#### Deploy API

1. Click **New** → **Web Service**
2. Connect your repo
3. Configure:
   - **Name**: `lms-api`
   - **Root Directory**: `apps/api`
   - **Runtime**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Plan**: Free

4. Add environment variables:
   ```
   NODE_ENV=production
   PORT=4000
   MONGO_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<generate-a-secure-secret>
   JWT_REFRESH_SECRET=<generate-another-secure-secret>
   FRONTEND_URL=<your-web-app-url>
   ```

#### Deploy Web (Frontend)

1. Click **New** → **Web Service**
2. Connect your repo
3. Configure:
   - **Name**: `lms-web`
   - **Root Directory**: `apps/web`
   - **Runtime**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Build Context**: `.`
   - **Plan**: Free

4. Add environment variables:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=<your-api-url>
   ```

---

## Step 3: Set Up CI/CD

### Enable Deploy Hooks (for GitHub Actions CD)

1. In Render, go to each service → **Settings** → **Deploy Hooks**
2. Copy the deploy hook URL
3. In GitHub, go to **Settings** → **Secrets and Variables** → **Actions**
4. Add secrets:
   - `RENDER_API_DEPLOY_HOOK`: Deploy hook URL for API
   - `RENDER_WEB_DEPLOY_HOOK`: Deploy hook URL for Web

Now pushes to `main` will trigger automatic deployments!

---

## Environment Variables Reference

### API (`apps/api`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `4000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | Random 32+ chars |
| `JWT_REFRESH_SECRET` | Refresh token secret | Random 32+ chars |
| `FRONTEND_URL` | Frontend URL for CORS | `https://lms-web.onrender.com` |

### Web (`apps/web`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `NEXT_PUBLIC_API_URL` | API base URL | `https://lms-api.onrender.com` |

---

## Local Development with Docker

```bash
# Development mode (with hot reload)
docker-compose up

# Production mode
docker-compose -f docker-compose.prod.yml up --build
```

---

## Troubleshooting

### API not starting
- Check `MONGO_URI` is correct
- Ensure MongoDB Atlas allows connections from `0.0.0.0/0`
- Check health endpoint: `GET /health`

### Frontend can't reach API
- Verify `NEXT_PUBLIC_API_URL` points to the correct API URL
- Check CORS: `FRONTEND_URL` must match your frontend domain

### Build failures
- Check Render logs for detailed error messages
- Ensure all dependencies are in `package.json`
