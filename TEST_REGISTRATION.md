# 🔧 Registration Troubleshooting Guide

## ❌ Problem Found
Your backend CORS is set to `http://localhost:3000` but your Netlify frontend is at a different URL.

## ✅ Solution Steps

### Step 1: Get Your Netlify URL
1. Go to https://app.netlify.com
2. Find your deployed site
3. Copy the URL (e.g., `https://your-app.netlify.app`)

### Step 2: Update CORS in Vercel
1. Go to https://vercel.com/dashboard
2. Open your `chatsphere-pro` project
3. Go to **Settings** → **Environment Variables**
4. Find `CORS_ORIGIN` and click **Edit**
5. Change value to your Netlify URL: `https://your-app.netlify.app`
6. Click **Save**

### Step 3: Redeploy Backend
1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**
4. Wait 2-3 minutes for deployment to complete

### Step 4: Test Backend Health
Open this URL in your browser:
```
https://chatsphere-pro.vercel.app/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "env": "production"
}
```

### Step 5: Test Registration Again
1. Go to your Netlify site
2. Try to register with a new account
3. Open browser console (F12) to see any errors

## 🔍 Debug Checklist

### Check Browser Console (F12)
Look for these errors:
- ❌ `CORS policy blocked` → CORS_ORIGIN not set correctly
- ❌ `Network error` → Backend not reachable
- ❌ `404 Not Found` → Wrong API URL
- ❌ `500 Internal Server Error` → Backend database issue

### Verify Environment Variables

**In Netlify (Site settings → Environment variables):**
```
VITE_API_URL = https://chatsphere-pro.vercel.app/api
VITE_SOCKET_URL = https://chatsphere-pro.vercel.app
```

**In Vercel (Settings → Environment variables):**
```
CORS_ORIGIN = https://your-netlify-url.netlify.app
MONGODB_URI = mongodb+srv://...
REDIS_URL = redis://...
JWT_SECRET = chatsphere_secret_key_2024_production
```

## 🚨 Common Issues

### Issue 1: CORS Error
**Symptom:** "Access to fetch has been blocked by CORS policy"
**Fix:** Update `CORS_ORIGIN` in Vercel to match your Netlify URL exactly

### Issue 2: 404 Not Found
**Symptom:** "Cannot POST /api/auth/register"
**Fix:** Check that `VITE_API_URL` in Netlify ends with `/api`

### Issue 3: Database Connection Error
**Symptom:** "MongooseError: Operation buffering timed out"
**Fix:** Verify `MONGODB_URI` is set correctly in Vercel

### Issue 4: JWT Error
**Symptom:** "jwt must be provided"
**Fix:** Verify `JWT_SECRET` is set in Vercel environment variables

## 📝 What to Tell Me

To help you further, please provide:

1. **Your Netlify URL:** `https://_____.netlify.app`
2. **Backend health check result:** What do you see at `https://chatsphere-pro.vercel.app/api/health`?
3. **Browser console error:** Press F12, go to Console tab, what's the error message?
4. **Network tab:** Press F12, go to Network tab, click on the failed request, what's the status code?

## 🎯 Quick Test Commands

### Test Backend from Command Line
```bash
curl https://chatsphere-pro.vercel.app/api/health
```

### Test Registration Endpoint
```bash
curl -X POST https://chatsphere-pro.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","phoneNumber":"+1234567890","password":"test123"}'
```

If this returns a CORS error, that confirms the issue!
