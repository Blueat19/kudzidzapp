================================================================================
CPANEL READY FILES - Tanga Kudzidza App (NODE.JS BACKEND)
================================================================================
Developer: SCW Digital | +263 78 709 0543
================================================================================

This folder contains the backend starter files for cPanel Node.js deployment.

FOLDER STRUCTURE:
-----------------

cpanel_ready_files/
├── backend/                    <- Upload to tangakudzidza_api folder
│   ├── app.js                  (Startup file for cPanel Node.js app)
│   ├── server.js               (Main Express application)
│   ├── package.json            (Node dependencies)
│   └── .env.example            (Copy to .env and edit)
│
├── frontend/                   <- Upload contents to public_html
│   └── .htaccess               (Required for React routing)
│
└── README.txt                  (This file)


DEPLOYMENT STEPS:
-----------------

1. BACKEND:
   - Create Node.js App in cPanel (Setup Node.js App)
   - Upload all files from backend/ folder
   - Rename .env.example to .env and update values
   - Run npm install from cPanel Node app UI
   - Restart the Node app

2. FRONTEND:
   - Build locally: npx expo export --platform web
   - Upload dist/ folder contents to public_html
   - Upload .htaccess from frontend/ folder to public_html

3. DATABASE:
   - Create MySQL database and user in cPanel
   - Grant the user all privileges on the database
   - Update .env with MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE


IMPORTANT NOTES:
----------------

- Frontend files (dist folder) must be built locally first
- Use MySQL database credentials from cPanel
- Keep your .env credentials private and restart app after updates
- After uploading .env or code changes, restart the Node app


FILES TO CREATE ON CPANEL:
--------------------------

1. .env file in backend folder (copy from .env.example)
2. The dist folder contents from local build


SUPPORT:
--------
SCW Digital: +263 78 709 0543

================================================================================
