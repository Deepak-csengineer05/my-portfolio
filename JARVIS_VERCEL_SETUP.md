# 🚀 JARVIS Vercel Setup Guide

Complete guide to migrate JARVIS from Netlify to Vercel with 100% backend security.

---

## ✅ Why Vercel?

| Feature | Netlify Free | Vercel Free |
|---------|--------------|-------------|
| **Serverless Functions** | 125K/month | **UNLIMITED** 🎉 |
| **Build Minutes** | 300/month | 6,000/month |
| **No credit card needed** | ✅ | ✅ |
| **Status** | ❌ Out of credits | ✅ Ready to use |

---

## 📂 Step 1: Files Already Created for You

I've created these files in your project:

1. **`/api/gemini.js`** - Vercel function for Gemini API
   - Smart model fallback (gemini-2.5-flash-lite → gemini-2.5-flash → gemini-1.5-flash)
   - Secure API key handling
   
2. **`/api/serper.js`** - Vercel function for web search
   - Calls Serper.dev API securely
   - Formats results for JARVIS

3. **`/vercel.json`** - Vercel configuration
   - Sets memory and timeout limits

---

## 🔧 Step 2: Update `jarvis.js` (MANUAL)

You need to make **2 changes** to `jarvis.js`:

### **Change 1: Update `getGeminiResponse` method**

**Find this (around line 368-408):**
```javascript
// Call Gemini API directly with model fallback
const models = ['gemini-2.5-flash-lite', 'gemini-2.5-flash'];

for (const model of models) {
    // ... long code block with fetch to Gemini API ...
}
```

**Replace with:**
```javascript
// Call Vercel serverless function
console.log('🚀 Calling Vercel Gemini API...');

const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: contextualPrompt })
});

if (!response.ok) {
    console.error('❌ Vercel function error:', response.status);
    return "I'm having trouble connecting to my AI systems. Please try again in a moment.";
}

const data = await response.json();
const aiResponse = data.response;

if (aiResponse) {
    console.log('✅ AI response received', data.modelUsed ? `(using ${data.modelUsed})` : '');
    return aiResponse;
}

return "I'm having trouble connecting to my AI systems. Please try again in a moment.";
```

### **Change 2: Update `performWebSearch` method**

**Find this (around line 432-467):**
```javascript
const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
        'X-API-KEY': this.serperApiKey,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ q: query, num: 3 })
});
```

**Replace with:**
```javascript
const response = await fetch('/api/serper', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: query })
});
```

### **Change 3: Remove API key loading**

**Find this (around line 64-73):**
```javascript
async loadAPIKey() {
    // Load API keys from window (set in index.html)
    this.geminiApiKey = window.GEMINI_API_KEY || null;
    this.serperApiKey = window.SERPER_API_KEY || null;
    
    console.log('🔑 API Keys loaded:', {
        gemini: !!this.geminiApiKey,
        serper: !!this.serperApiKey
    });
}
```

**Replace with:**
```javascript
async loadAPIKey() {
    // No longer needed - API keys are on Vercel backend
    console.log('🔑 API keys secured on Vercel backend');
}
```

---

## 🎯 Step 3: Remove Old Files

Delete these files (no longer needed):
- `jarvis-config.js`
- `netlify/functions/gemini-proxy.js` (optional - you can keep netlify folder)
- `netlify/functions/serper-search.js` (optional)

Update `index.html` - **Remove this line** (around line 986):
```html
<script src='jarvis-config.js'></script>  <!-- DELETE THIS LINE -->
```

---

## 🌐 Step 4: Deploy to Vercel

### **Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → my-portfolio (or your choice)
- **Directory?** → `./`
- **Override settings?** → No

### **Option B: Using Vercel Dashboard**

1. Go to: https://vercel.com
2. Sign up / Login (can use GitHub)
3. Click **Add New** → **Project**
4. Import your Git repository
5. Click **Deploy**

---

## 🔑 Step 5: Add Environment Variables

In Vercel Dashboard:

1. Go to your project
2. Click **Settings** → **Environment Variables**
3. Add these 2 variables:

   **Variable 1:**
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `your_gemini_api_key`
   - **Environments**: Check all (Production, Preview, Development)

   **Variable 2:**
   - **Key**: `SERPER_API_KEY`
   - **Value**: `your_serper_api_key`
   - **Environments**: Check all (Production, Preview, Development)

4. Click **Save**
5. **Redeploy** → Go to **Deployments** → Click  **⋯** on latest → **Redeploy**

---

## ✅ Step 6: Test JARVIS

1. Open your Vercel URL (e.g., `https://my-portfolio.vercel.app`)
2. Type **"ironman"** to activate theme
3. Click JARVIS button
4. Test: **"Hi"** → Should work
5. Test: **"What's the latest AI news?"** → Should search web

### **Check Console (F12):**
```
🔑 API keys secured on Vercel backend
🔍 Web search detected, performing search...
🚀 Calling Vercel Gemini API...
✅ AI response received (using gemini-2.5-flash-lite)
```

---

## 🎉 Benefits of Vercel

- ✅ **Unlimited serverless functions** (no credit limits!)
- ✅ **100% secure** (API keys hidden on backend)
- ✅ **Fast** (global edge network)
- ✅ **Auto-deploys** from Git pushes
- ✅ **No interruptions** (very generous free tier)

---

## 🛠️ Troubleshooting

### "Function returned status 500"
- Check environment variables are set in Vercel
- Redeploy after adding variables

### "Cannot find module '/api/gemini'"
- Make sure files are in `/api/` folder (not `/api` without slash)
- File names: `gemini.js` and `serper.js` (not `.ts`)

### "CORS error"
- Vercel functions have CORS headers built-in
- Make sure you're calling `/api/gemini` (relative path)

---

## 📝 Summary

**What we did:**
1. ✅ Created Vercel serverless functions (`/api/gemini.js`, `/api/serper.js`)
2. ⏳ Need to update `jarvis.js` to call Vercel functions
3. ⏳ Need to deploy to Vercel and add API keys

**Result:** JARVIS will work with **unlimited requests** and **100% security**! 🚀
