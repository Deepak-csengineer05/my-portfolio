# Portfolio Hosting & Update Guide

This guide describes how to host your portfolio for free and how to issue updates easily.

> [!IMPORTANT]
> **Before you start:**
> Rename your main file from `portfoliotest.html` to **`index.html`**.
> Web servers look for `index.html` by default. If you keep it as `portfoliotest.html`, your site URL would look like `yourname.github.io/portfoliotest.html` instead of just `yourname.github.io`.

---

## Phase 1: Uploading to GitHub (Required for all options)

To make "future updates" easy, you should store your code on GitHub. This allows you to just "save and push" to update your live site automatically.

1.  **Initialize Git (if not already done)**
    Open your terminal in `e:\completed projects\personal portfolio` and run:
    ```bash
    git init
    git add .
    git commit -m "Initial portfolio commit"
    ```

2.  **Create a Repository on GitHub**
    -   Go to [github.com/new](https://github.com/new).
    -   Name it something like `my-portfolio`.
    -   Keep it **Public** (required for free GitHub Pages).
    -   Click **Create repository**.

3.  **Push your code**
    -   Copy the commands GitHub shows you under "…or push an existing repository from the command line". They will look like this:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/my-portfolio.git
    git branch -M main
    git push -u origin main
    ```

---

## Phase 2: Choose Your Host

You can use any of these free services. They all connect to your GitHub repo.

### Option A: GitHub Pages (Easiest)
**Pros:** Built into GitHub, completely free.
**Cons:** Slightly slower updates (takes 1-2 mins to show).

1.  Go to your Repository on GitHub.
2.  Click **Settings** (top right tab).
3.  On the left sidebar, click **Pages**.
4.  Under **Source**, verify it says **Deploy from a branch**.
5.  Under **Branch**, select `main` and `/ (root)`, then click **Save**.
6.  Wait 1-2 minutes. Refresh the page, and it will show you your live URL (e.g., `https://yourusername.github.io/my-portfolio/`).

### Option B: Vercel (Fastest & Best Performance)
**Pros:** Instant updates, very fast custom domains, great for performance.

1.  Go to [vercel.com](https://vercel.com) and Sign Up with GitHub.
2.  Click **Add New...** > **Project**.
3.  You will see your `my-portfolio` repo in the list. Click **Import**.
4.  Keep all settings default. Click **Deploy**.
5.  Wait 30 seconds. Your site is now live!

### Option C: Netlify (Great Alternatives)
**Pros:** Very easy drag-and-drop (optional), good free tier.

1.  Go to [netlify.com](https://netlify.com) and Sign Up with GitHub.
2.  Click **Add new site** > **Import from an existing project**.
3.  Select **GitHub**.
4.  Authorize Netlify, then pick your `my-portfolio` repo.
5.  Click **Deploy Site**.

---

## Phase 3: How to Make Future Updates

This is the best part. Since you linked everything to GitHub, you **do not** need to go to Vercel/Netlify/GitHub Settings ever again to update the site.

**Whenever you make changes to your code (edit HTML, change CSS, new images):**

1.  Open your terminal.
2.  Run these 3 commands:
    ```bash
    git add .
    git commit -m "Updated text and colors"
    git push
    ```

**That's it!**
-   **GitHub Pages** will update in ~2 minutes.
-   **Vercel/Netlify** will update in ~30 seconds.
