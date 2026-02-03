================================================================================
CPANEL READY FILES - Tanga Kudzidza App
================================================================================
Developer: SCW Digital | +263 78 709 0543
================================================================================

This folder contains all the files you need to deploy to cPanel.

FOLDER STRUCTURE:
-----------------

cpanel_ready_files/
├── backend/                    <- Upload to tangakudzidza_api folder
│   ├── server.py               (Main FastAPI application)
│   ├── requirements.txt        (Python dependencies)
│   ├── passenger_wsgi.py       (Required for cPanel - main version)
│   ├── passenger_wsgi_simple.py (Backup - use if main doesn't work)
│   └── .env.example            (Copy to .env and edit)
│
├── frontend/                   <- Upload contents to public_html
│   └── .htaccess               (Required for React routing)
│
└── README.txt                  (This file)


DEPLOYMENT STEPS:
-----------------

1. BACKEND:
   - Create Python App in cPanel (Setup Python App)
   - Upload all files from backend/ folder
   - Rename .env.example to .env and update MONGO_URL
   - Install dependencies: pip install -r requirements.txt
   - Restart the Python app

2. FRONTEND:
   - Build locally: npx expo export --platform web
   - Upload dist/ folder contents to public_html
   - Upload .htaccess from frontend/ folder to public_html

3. DATABASE:
   - Create free MongoDB Atlas account
   - Get connection string and update .env


IMPORTANT NOTES:
----------------

- The frontend files (dist folder) must be built locally first
- Use MongoDB Atlas for database (free tier available)
- Make sure to add your cPanel server IP to MongoDB whitelist
- After uploading, always restart the Python app in cPanel


FILES TO CREATE ON CPANEL:
--------------------------

1. .env file in backend folder (copy from .env.example)
2. The dist folder contents from local build


SUPPORT:
--------
SCW Digital: +263 78 709 0543

================================================================================
