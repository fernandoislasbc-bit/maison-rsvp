# Maison RSVP — Hostinger Deployment Guide

## Node.js Version
**Required: Node.js 20.x**
Set this in Hostinger hPanel → Node.js → Node.js Version.

---

## Files to Upload to Hostinger

Upload ONLY these files/folders (do not upload node_modules or .git):

```
maison-rsvp/
├── .next/              ← compiled production build (required)
├── public/             ← images, videos, assets
├── src/                ← source files
├── package.json        ← dependencies list
├── package-lock.json   ← exact dependency versions
├── next.config.ts      ← Next.js configuration
├── tsconfig.json       ← TypeScript config
└── server.js           ← startup file for Hostinger
```

DO NOT upload:
- node_modules/ (Hostinger installs this for you)
- .git/
- .next/cache/ (inside .next, skip the cache folder if possible)

---

## Step-by-Step Hostinger Setup

### 1. Create Node.js App in hPanel
- Go to hPanel → Hosting → Node.js
- Click "Create Application"
- Set:
  - **Node.js version:** 20.x
  - **Application root:** /public_html/maison-rsvp (or your chosen folder)
  - **Application URL:** your domain or subdomain
  - **Startup file:** server.js

### 2. Upload Files
Use Hostinger File Manager or FTP (FileZilla):
- Upload all files listed above into the application root folder
- Make sure .next/ folder is included — this is the compiled site

### 3. Install Dependencies (via Hostinger Terminal or SSH)
```bash
cd ~/public_html/maison-rsvp
npm install --production
```

### 4. Start the Application
In hPanel → Node.js → click "Restart" on your app.

Or via SSH:
```bash
npm run start
```

---

## Environment Variables
Set these in hPanel → Node.js → Environment Variables:

| Variable   | Value        |
|------------|--------------|
| NODE_ENV   | production   |
| PORT       | 3000         |

---

## npm Scripts Reference
```bash
npm run dev      # local development
npm run build    # compile for production (run locally before upload)
npm run start    # start production server
```

---

## Important Notes

1. **Always run `npm run build` locally before uploading.** The .next/ folder 
   is the compiled output — Hostinger does not build it for you.

2. **Re-upload .next/ every time you make changes** to the site.

3. **The startup file is server.js** — make sure this is set correctly in 
   hPanel Node.js settings.

4. **If images don't load**, check that the public/ folder was uploaded 
   completely, including all subfolders under public/assets/.

5. **If the site shows a blank page**, SSH in and check logs:
   ```bash
   cat ~/.npm/_logs/*.log
   ```

---

## FTP Upload via FileZilla

1. Download FileZilla: filezilla-project.org
2. In Hostinger hPanel → FTP Accounts → create an FTP account
3. Open FileZilla:
   - Host: your domain or FTP hostname from hPanel
   - Username: your FTP username
   - Password: your FTP password
   - Port: 21
4. Navigate to /public_html/maison-rsvp on the right panel
5. Drag and drop the required files from your Mac

---

## Verify Deployment

After starting the app, visit your domain. You should see the Maison RSVP 
homepage with the scroll hero animation.

If you see a 502 error, the Node.js app is not running — go to hPanel → 
Node.js and click Restart.

---

Built with Next.js 16 · React 19 · TypeScript · GSAP · Tailwind CSS v4
