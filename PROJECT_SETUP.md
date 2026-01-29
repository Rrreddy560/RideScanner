# Complete Project Setup

## 📁 Project Structure

```
ride-aggregator/
│
├── frontend/                          # React App
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── LocationInput.jsx     # Reusable location picker
│   │   │   ├── RideCard.jsx          # Individual ride display
│   │   │   └── LoadingSpinner.jsx    # Loading animation
│   │   ├── App.jsx                   # Main app (use ride-aggregator.jsx)
│   │   ├── index.css                 # Tailwind imports
│   │   └── main.jsx                  # React entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                           # Express API
│   ├── routes/
│   │   ├── rides.js                  # /api/rides endpoints
│   │   └── geocode.js                # /api/geocode endpoints
│   ├── services/
│   │   ├── uber.js                   # Uber API integration
│   │   ├── ola.js                    # Ola integration
│   │   ├── rapido.js                 # Rapido integration
│   │   └── nammayatri.js             # Namma Yatri integration
│   ├── utils/
│   │   ├── cache.js                  # Redis caching
│   │   └── deeplinks.js              # Deep link generation
│   ├── server.js                     # Main server file
│   ├── package.json
│   └── .env                          # Environment variables
│
├── docs/
│   ├── API.md                        # API documentation
│   └── DEPLOYMENT.md                 # Deployment guide
│
└── README.md
```

---

## 📦 Frontend Package.json

```json
{
  "name": "ride-aggregator-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.294.0",
    "framer-motion": "^10.16.5"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8"
  }
}
```

---

## 📦 Backend Package.json

```json
{
  "name": "ride-aggregator-backend",
  "version": "1.0.0",
  "description": "Backend API for ride aggregation service",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Add tests later\" && exit 0"
  },
  "keywords": ["ride", "aggregator", "api", "uber", "ola"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "axios": "^1.6.2",
    "dotenv": "^16.3.1",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  },
  "optionalDependencies": {
    "puppeteer": "^21.6.1",
    "redis": "^4.6.11"
  }
}
```

---

## ⚙️ Configuration Files

### frontend/vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
```

### backend/.env.example
```
# Server Configuration
PORT=3001
NODE_ENV=development

# API Keys (Get these from respective providers)
UBER_API_KEY=your_uber_api_key_here
OLA_API_KEY=your_ola_api_key_here
RAPIDO_API_KEY=your_rapido_api_key_here

# Geocoding (Optional - using free OpenStreetMap by default)
GOOGLE_MAPS_API_KEY=your_google_maps_key_here

# Redis (Optional - for caching)
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🚀 Quick Start Commands

### First Time Setup

```bash
# Clone or create project
mkdir ride-aggregator
cd ride-aggregator

# Setup frontend
npx create-vite@latest frontend -- --template react
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react framer-motion
cd ..

# Setup backend
mkdir backend
cd backend
npm init -y
npm install express cors axios dotenv express-rate-limit helmet morgan
npm install --save-dev nodemon
cd ..
```

### Daily Development

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev

# Or use concurrently to run both
npm install -g concurrently
concurrently "npm --prefix frontend run dev" "npm --prefix backend run dev"
```

---

## 🔧 Environment Setup Checklist

### Required Tools
- [x] Node.js 18+ (https://nodejs.org/)
- [x] Git (https://git-scm.com/)
- [x] Code editor (VS Code recommended)
- [x] Browser (Chrome/Firefox with dev tools)

### Optional Tools
- [ ] Redis (for caching)
- [ ] Postman (API testing)
- [ ] Docker (for deployment)

### API Accounts to Create
1. **Namma Yatri** (Start here!)
   - GitHub: https://github.com/nammayatri/nammayatri
   - Email: contact@nammayatri.in

2. **Uber Developer**
   - Sign up: https://developer.uber.com/
   - Create app, get API key
   - Enable "Price Estimates" product

3. **Google Maps Platform** (for geocoding)
   - Console: https://console.cloud.google.com/
   - Enable Geocoding API
   - Free tier: 40,000 requests/month

4. **Ola & Rapido**
   - Contact via email for partnership
   - May take 2-4 weeks

---

## 🎨 VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "formulahendry.auto-close-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

Save as `.vscode/extensions.json`

---

## 🧪 Testing Your Setup

### Test Frontend
```bash
cd frontend
npm run dev
# Visit http://localhost:5173
# You should see the ride aggregator UI
```

### Test Backend
```bash
cd backend
npm run dev
# Visit http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Test API Connection
```bash
# Test geocoding endpoint
curl -X POST http://localhost:3001/api/geocode \
  -H "Content-Type: application/json" \
  -d '{"address":"Mumbai, India"}'

# Should return coordinates
```

---

## 📱 Mobile Testing Setup

### Option 1: Browser DevTools
1. Open Chrome DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select device (iPhone 12, Pixel 5, etc.)
4. Test responsive design

### Option 2: Ngrok (Test on Real Phone)
```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 5173

# Use the ngrok URL on your phone
# Example: https://abc123.ngrok.io
```

### Option 3: LAN Access
```bash
# In vite.config.js, add:
server: {
  host: '0.0.0.0',  // Expose to network
  port: 5173
}

# Then visit from phone:
# http://YOUR_COMPUTER_IP:5173
# Find IP: ipconfig (Windows) or ifconfig (Mac/Linux)
```

---

## 🐛 Common Setup Issues & Fixes

### Issue: "npm install" fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install again
npm install
```

### Issue: Port already in use
```bash
# Kill process on port 3001 (backend)
# Windows:
netstat -ano | findstr :3001
taskkill /PID [PID_NUMBER] /F

# Mac/Linux:
lsof -ti:3001 | xargs kill -9
```

### Issue: CORS errors
```javascript
// In backend/server.js, update CORS:
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue: Tailwind not working
```javascript
// Verify tailwind.config.js has correct paths:
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],

// Verify index.css has imports:
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 📚 Next Steps After Setup

1. **Copy the main component**
   - Move `ride-aggregator.jsx` to `frontend/src/App.jsx`
   - Update imports if needed

2. **Copy the backend**
   - Move `server.js` to `backend/server.js`
   - Create `.env` file with your API keys

3. **Test with mock data first**
   - Run both frontend and backend
   - Make sure UI works perfectly
   - Test all animations and interactions

4. **Add real API integration**
   - Start with Namma Yatri (easiest)
   - Test thoroughly
   - Add error handling

5. **Deploy MVP**
   - See DEPLOYMENT.md for detailed steps
   - Frontend: Vercel
   - Backend: Railway/Render

---

## 💡 Pro Tips

1. **Use git from the start**
```bash
git init
git add .
git commit -m "Initial setup"
```

2. **Create .gitignore**
```
node_modules/
.env
.DS_Store
dist/
build/
*.log
```

3. **Document as you go**
- Keep notes of API integrations
- Document any workarounds
- Track bugs and fixes

4. **Test on real devices early**
- Don't wait until the end
- Test on Android AND iPhone
- Check on slow connections

---

You now have everything you need to start building! The frontend and backend files are ready, dependencies are listed, and the setup process is clear. 

Start with the mock data version, perfect the UI/UX, then gradually add real API integrations. Good luck! 🚀
