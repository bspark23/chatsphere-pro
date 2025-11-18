# 🔑 Environment Variables Explained

## What are Environment Variables?

Environment variables are **KEY=VALUE** pairs that configure your app.

**Format**: `KEY=VALUE`
- **KEY** = The name (what it's called)
- **VALUE** = The actual data (what it contains)

---

## 📋 Your Environment Variables

### For Vercel (Backend Deployment)

When deploying to Vercel, add these ONE BY ONE:

#### 1. NODE_ENV
```
Key (Name):   NODE_ENV
Value (Data): production
```
**What it does**: Tells the app it's running in production mode

---

#### 2. PORT
```
Key (Name):   PORT
Value (Data): 5000
```
**What it does**: The port number your backend runs on

---

#### 3. MONGODB_URI
```
Key (Name):   MONGODB_URI
Value (Data): mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/chatsphere
```
**What it does**: Connection string to your MongoDB database

**Your value**: You'll get this from MongoDB Atlas after creating your cluster

**Example**:
```
mongodb+srv://chatsphere:mypassword123@cluster0.abc123.mongodb.net/chatsphere
```

---

#### 4. REDIS_URL
```
Key (Name):   REDIS_URL
Value (Data): redis://default:1kMi7Ub4wgM4DdotkIlWLJZtKbbc0cFf@redis-13492.c258.us-east-1-4.ec2.cloud.redislabs.com:13492
```
**What it does**: Connection string to your Redis Cloud database

**Your actual value** (use this exactly):
```
redis://default:1kMi7Ub4wgM4DdotkIlWLJZtKbbc0cFf@redis-13492.c258.us-east-1-4.ec2.cloud.redislabs.com:13492
```

---

#### 5. JWT_SECRET
```
Key (Name):   JWT_SECRET
Value (Data): chatsphere_secret_key_2024_production
```
**What it does**: Secret key for encrypting user sessions

**Your value** (use this or create your own):
```
chatsphere_secret_key_2024_production
```

---

#### 6. CORS_ORIGIN
```
Key (Name):   CORS_ORIGIN
Value (Data): https://your-app.netlify.app
```
**What it does**: Allows your frontend to talk to your backend

**Your value**: Replace with your actual Netlify URL after deploying frontend

**Example**:
```
https://chatsphere-pro.netlify.app
```

---

## 📝 How to Add in Vercel

### Step-by-Step:

1. Go to your Vercel project
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in sidebar
4. For each variable:
   - Click **"Add New"**
   - **Key**: Enter the KEY (e.g., `NODE_ENV`)
   - **Value**: Enter the VALUE (e.g., `production`)
   - Click **"Save"**

### Visual Example:

```
┌─────────────────────────────────────┐
│ Add Environment Variable            │
├─────────────────────────────────────┤
│ Key:   [NODE_ENV              ]     │
│ Value: [production            ]     │
│                                     │
│ [Cancel]  [Save]                    │
└─────────────────────────────────────┘
```

---

## 🎯 Complete List for Copy-Paste

### Backend (Vercel):

```
Key: NODE_ENV
Value: production

Key: PORT
Value: 5000

Key: MONGODB_URI
Value: mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/chatsphere

Key: REDIS_URL
Value: redis://default:1kMi7Ub4wgM4DdotkIlWLJZtKbbc0cFf@redis-13492.c258.us-east-1-4.ec2.cloud.redislabs.com:13492

Key: JWT_SECRET
Value: chatsphere_secret_key_2024_production

Key: CORS_ORIGIN
Value: https://your-app.netlify.app
```

**Note**: Replace `YOUR_USERNAME`, `YOUR_PASSWORD`, and `your-app` with your actual values!

---

## 🎨 Frontend (Netlify):

### Step-by-Step:

1. Go to your Netlify site
2. Click **"Site settings"**
3. Click **"Environment variables"**
4. Add these:

```
Key: VITE_API_URL
Value: https://your-backend.vercel.app/api

Key: VITE_SOCKET_URL
Value: https://your-backend.vercel.app
```

**Note**: Replace `your-backend` with your actual Vercel URL!

---

## 📊 Summary Table

| Key | Value | Where | What It Does |
|-----|-------|-------|--------------|
| `NODE_ENV` | `production` | Vercel | Production mode |
| `PORT` | `5000` | Vercel | Backend port |
| `MONGODB_URI` | `mongodb+srv://...` | Vercel | Database connection |
| `REDIS_URL` | `redis://default:1kMi...` | Vercel | Redis connection |
| `JWT_SECRET` | `chatsphere_secret...` | Vercel | Session encryption |
| `CORS_ORIGIN` | `https://your-app...` | Vercel | Frontend URL |
| `VITE_API_URL` | `https://your-backend...` | Netlify | Backend API URL |
| `VITE_SOCKET_URL` | `https://your-backend...` | Netlify | WebSocket URL |

---

## ✅ Your Actual Values

### Redis (Already Have):
```
redis://default:1kMi7Ub4wgM4DdotkIlWLJZtKbbc0cFf@redis-13492.c258.us-east-1-4.ec2.cloud.redislabs.com:13492
```

### MongoDB (Need to Get):
- Go to MongoDB Atlas
- Create cluster
- Get connection string
- Will look like: `mongodb+srv://user:pass@cluster.mongodb.net/chatsphere`

### URLs (Will Get After Deploying):
- **Vercel URL**: `https://chatsphere-backend.vercel.app`
- **Netlify URL**: `https://chatsphere-pro.netlify.app`

---

## 🎯 Quick Reference

### When Adding to Vercel:
- **Left box (Key)**: The name (e.g., `PORT`)
- **Right box (Value)**: The data (e.g., `5000`)

### When Adding to Netlify:
- **Left box (Key)**: The name (e.g., `VITE_API_URL`)
- **Right box (Value)**: The data (e.g., `https://your-backend.vercel.app/api`)

---

## 🎉 That's It!

**Key** = Name of the variable
**Value** = The actual data

Just copy the KEY into the "Key" field and the VALUE into the "Value" field!

**See `SIMPLIFIED_DEPLOYMENT.md` for complete deployment guide!**
