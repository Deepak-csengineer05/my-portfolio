# JARVIS Web Search Setup Guide

## 🎯 What You Need to Do

You need to add your Serper.dev API key to Netlify so JARVIS can perform web searches.

---

## 📋 Step-by-Step Instructions

### **Option 1: For Netlify Hosting (Production)**

1. **Go to your Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Select your portfolio site

2. **Navigate to Environment Variables**
   - Click on **Site settings**
   - Scroll to **Environment variables** section
   - Click **Add a variable**

3. **Add the API Key**
   - **Key**: `SERPER_API_KEY`
   - **Value**: `[paste your Serper.dev API key here]`
   - **Scopes**: Select "All scopes" or "Production" and "Deploy previews"
   - Click **Create variable**

4. **Redeploy Your Site**
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**
   - Wait for deployment to complete (~1-2 minutes)

---

### **Option 2: For Local Development**

If you're running the site locally with Netlify Dev:

1. **Create a `.env` file** in your project root (if it doesn't exist)

2. **Add your API key to `.env`:**
   ```
   SERPER_API_KEY=your_api_key_here
   ```

3. **Make sure `.env` is in `.gitignore`** (to keep your key secure)

4. **Restart your dev server:**
   ```bash
   netlify dev
   ```

---

## ✅ How to Test

Once you've added the API key and redeployed:

1. **Open your portfolio**
2. **Activate Iron Man theme** (type "ironman" on the main page)
3. **Open JARVIS chatbot** (click the arc reactor icon)
4. **Test with these queries:**
   - "What's the latest news about AI?"
   - "What happened in tech today?"
   - "Tell me recent AI developments"
   - "What's trending in technology?"

**Expected Result:** JARVIS will search the web and provide up-to-date information with sources! 🎉

---

## 🔍 Troubleshooting

### If JARVIS doesn't search:
- Check browser console (F12) for error messages
- Verify the API key is correctly added in Netlify
- Make sure you redeployed after adding the key

### If you see "API key not configured":
- Double-check the environment variable name is exactly `SERPER_API_KEY`
- Verify you saved and deployed changes in Netlify

### For local development:
- Make sure you're running `netlify dev` (not just `npm run dev`)
- Check that `.env` file exists and has the correct key

---

## 📊 Rate Limits

- **Free Tier**: 2,500 searches per month
- **No credit card required**
- Monitor usage at: https://serper.dev/dashboard

---

## 🎉 Features Now Available

Once set up, JARVIS can answer:
- ✅ Current news and events
- ✅ Recent developments in any field
- ✅ "What happened today/this week" queries
- ✅ Trending topics
- ✅ And more time-sensitive questions!

**Your JARVIS just got a major upgrade!** 🚀
