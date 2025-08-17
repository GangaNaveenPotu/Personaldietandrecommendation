# Deployment Guide for Diet Recommendation App

## Overview
This app consists of three separate services that need to be deployed independently:
1. **Frontend** (React)
2. **Backend** (Node.js + Express)
3. **ML Service** (Python + Flask)

## 1. Frontend Deployment (Vercel/Netlify)

### Prerequisites
- Node.js 16+ installed
- Git repository connected

### Steps
1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Build the app:**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel:**
   - Connect your GitHub repo to Vercel
   - Set build command: `npm run build`
   - Set output directory: `build`
   - Add environment variables:
     ```
     REACT_APP_API_URL=https://your-backend-url
     REACT_APP_ML_API_URL=https://your-ml-service-url
     ```

4. **Deploy to Netlify:**
   - Connect your GitHub repo to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variables in Netlify dashboard

## 2. Backend Deployment (Railway/Heroku)

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account

### Steps
1. **Set up MongoDB Atlas:**
   - Create cluster
   - Get connection string
   - Set up database user

2. **Deploy to Railway:**
   - Connect GitHub repo
   - Set environment variables:
     ```
     MONGO_USERNAME=your_username
     MONGO_PASSWORD=your_password
     MONGO_DB=your_database
     MONGO_CLUSTER=your_cluster
     PORT=5000
     ```

3. **Deploy to Heroku:**
   - Install Heroku CLI
   - Create app: `heroku create your-app-name`
   - Set environment variables:
     ```bash
     heroku config:set MONGO_USERNAME=your_username
     heroku config:set MONGO_PASSWORD=your_password
     heroku config:set MONGO_DB=your_database
     heroku config:set MONGO_CLUSTER=your_cluster
     heroku config:set PORT=5000
     ```
   - Deploy: `git push heroku main`

## 3. ML Service Deployment (Railway/Heroku)

### Prerequisites
- Python 3.8+ installed
- Git repository

### Steps
1. **Deploy to Railway:**
   - Connect GitHub repo
   - Set Python runtime
   - Set environment variables:
     ```
     PORT=5001
     ```

2. **Deploy to Heroku:**
   - Create app: `heroku create your-ml-app-name`
   - Set buildpack: `heroku buildpacks:set heroku/python`
   - Deploy: `git push heroku main`

## 4. Update Frontend URLs

After deploying all services, update the frontend environment variables:

```bash
# In Vercel/Netlify dashboard
REACT_APP_API_URL=https://your-backend-url
REACT_APP_ML_API_URL=https://your-ml-service-url
```

## 5. Test Deployment

1. **Test ML Service:**
   ```bash
   curl https://your-ml-service-url/
   ```

2. **Test Backend:**
   ```bash
   curl https://your-backend-url/api/profile
   ```

3. **Test Frontend:**
   - Open deployed frontend URL
   - Test login/registration
   - Test chat functionality

## 6. Environment Variables Reference

### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-backend-url
REACT_APP_ML_API_URL=https://your-ml-service-url
REACT_APP_NODE_ENV=production
```

### Backend
```
MONGO_USERNAME=your_username
MONGO_PASSWORD=your_password
MONGO_DB=your_database
MONGO_CLUSTER=your_cluster
PORT=5000
```

### ML Service
```
PORT=5001
```

## 7. Troubleshooting

### Common Issues:
1. **CORS errors:** Update CORS origins in both backends
2. **Database connection:** Check MongoDB Atlas network access
3. **Build failures:** Check Node.js/Python versions
4. **Environment variables:** Ensure all required vars are set

### Health Checks:
- Backend: `GET /api/profile`
- ML Service: `GET /`
- Frontend: Check browser console for errors 