# Quick Start

## 1. Install dependencies
```powershell
cd "E:\AI-Powered College Placement & Career Portal"
npm run install:all
```

## 2. Install MongoDB (one-time, if not installed)
```powershell
winget install MongoDB.Server
```
Or download from https://www.mongodb.com/try/download/community

## 3. Run the app
```powershell
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000/api

## Demo Login
| Role | Email | Password |
|------|-------|----------|
| Student | student@example.com | Student@123 |
| Admin | admin@example.com | Admin@123 |

> Database auto-seeds on first run with demo data.
