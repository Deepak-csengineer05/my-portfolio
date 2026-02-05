# 🤖 JARVIS AI Assistant - Setup Guide

## Overview
JARVIS (Just A Rather Very Intelligent System) is an AI-powered portfolio assistant that appears exclusively in the Iron Man theme. It's powered by Google Gemini AI and features voice recognition, text-to-speech, and intelligent portfolio navigation.

---

## Quick Start

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure API Key

**Option A: Using .env file (Recommended for local)**

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

**Option B: Inline (For production/hosting)**

If .env doesn't work on your hosting platform, add this to your HTML before `jarvis.js`:

```html
<script>
    window.GEMINI_API_KEY = 'your_actual_api_key_here';
</script>
<script src='jarvis.js'></script>
```

### 3. Activate Iron Man Theme

1. Open your portfolio
2. Type `ironman` anywhere on the page
3. The "Speak with JARVIS" button appears in the top-right

### 4. Use JARVIS

- **Click the button** to open JARVIS
- **Click the microphone** to speak
- **Type your question** in the input box
- **Try commands like:**
  - "Tell me about Deepak"
  - "Show me his projects"
  - "What skills does he have?"
  - "Change theme to quantum"
  - "Navigate to contact section"

---

## Features

### ✅ What JARVIS Can Do

- Answer questions about your portfolio
- Navigate to different sections
- Switch themes
- Respond to voice commands
- Speak responses aloud (text-to-speech)
- Provide intelligent AI-powered answers

### ❌ What JARVIS Won't Do

- Answer general knowledge questions
- Help visitors with coding problems
- Respond to off-topic questions
- Work outside the Iron Man theme

---

## Updating Knowledge Base

Edit `jarvis-knowledge.json` to update JARVIS's knowledge:

```json
{
  "owner": {
    "name": "Your Name",
    "title": "Your Title",
    ...
  },
  "bio": "Your updated bio",
  "currentFocus": "What you're working on now",
  "funFacts": ["New fact 1", "New fact 2"]
}
```

JARVIS will automatically use the updated information!

---

## Customization

### Change JARVIS Personality

In `jarvis-knowledge.json`:

```json
{
  "jarvisPersonality": {
    "greeting": "Custom greeting message",
    "offTopicResponse": "Custom off-topic response",
    "tone": "Describe the personality"
  }
}
```

### Modify Styling

Edit `jarvis.css` to change:
- Colors (search for `#ffd700` and `#ff4444`)
- Window size (`.jarvis-window` width/height)
- Glassmorphism effect (`backdrop-filter` values)

---

## Troubleshooting

### JARVIS button doesn't appear
- Make sure you're in Iron Man theme (type `ironman`)
- Check browser console for error messages

### Voice input not working
- Grant microphone permissions when prompted
- Chrome/Edge work best for speech recognition
- Check if HTTPS is enabled (required for mic access)

### AI responses not working
- Verify API key is correctly set
- Check browser console for API errors
- Ensure you have Gemini API quota available

### Button appears on mobile
- This is intentional - JARVIS is disabled on mobile for performance
- Test on desktop/laptop for full experience

---

## Security Notes

🔒 **Important:**
- Never commit `.env` file to GitHub
- Add `.env` to your `.gitignore`
- Keep your API key private
- Monitor API usage on Google AI Studio

---

## Browser Support

- ✅ Chrome/Edge (Best experience)
- ✅ Firefox (AI works, voice limited)
- ✅ Safari (AI works, voice limited)
- ❌ Mobile browsers (Intentionally disabled)

---

## Files Created

- `jarvis.js` - Main AI logic
- `jarvis.css` - Glassmorphism styling
- `jarvis-knowledge.json` - Portfolio knowledge base
- `.env.example` - API key template

---

## Need Help?

Check browser console (F12) for detailed error messages!

---

**Enjoy your personal JARVIS! 🦾✨**
