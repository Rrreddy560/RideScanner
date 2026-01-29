// server.js - Backend API for Ride Aggregator
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// ============================================
// API ENDPOINTS FOR DIFFERENT SERVICES
// ============================================

// Namma Yatri API (Open Source - Good starting point!)
async function getNammaYatriRides(from, to) {
  try {
    // Namma Yatri has a public API
    // Documentation: https://github.com/nammayatri/nammayatri
    const response = await axios.post('https://api.nammayatri.in/v1/estimate', {
      fromLocation: from,
      toLocation: to
    });
    
    return {
      service: 'Namma Yatri',
      type: 'Auto',
      price: response.data.estimatedFare,
      eta: response.data.estimatedTime,
      deepLink: `nammayatri://ride?from=${from.lat},${from.lng}&to=${to.lat},${to.lng}`
    };
  } catch (error) {
    console.error('Namma Yatri API error:', error);
    return null;
  }
}

// Uber API (Requires Partner Account)
async function getUberRides(from, to) {
  try {
    // You need to register as Uber partner: https://developer.uber.com
    // This requires OAuth and approval process
    const UBER_API_KEY = process.env.UBER_API_KEY;
    
    const response = await axios.get('https://api.uber.com/v1.2/estimates/price', {
      headers: {
        'Authorization': `Bearer ${UBER_API_KEY}`,
        'Accept-Language': 'en_IN',
        'Content-Type': 'application/json'
      },
      params: {
        start_latitude: from.lat,
        start_longitude: from.lng,
        end_latitude: to.lat,
        end_longitude: to.lng
      }
    });

    return response.data.prices.map(ride => ({
      service: 'Uber',
      type: ride.display_name,
      price: ride.low_estimate,
      eta: ride.duration / 60, // Convert to minutes
      deepLink: `uber://?action=setPickup&pickup[latitude]=${from.lat}&pickup[longitude]=${from.lng}&dropoff[latitude]=${to.lat}&dropoff[longitude]=${to.lng}`
    }));
  } catch (error) {
    console.error('Uber API error:', error);
    return [];
  }
}

// Ola API (Limited Access - May need web scraping fallback)
async function getOlaRides(from, to) {
  try {
    // Ola doesn't have a public API readily available
    // Options:
    // 1. Apply for Ola Partner API access
    // 2. Use web scraping (see below)
    // 3. Use mock data for MVP
    
    // For now, return mock data structure
    return [
      {
        service: 'Ola',
        type: 'Mini',
        price: 180,
        eta: 3,
        deepLink: 'https://www.olacabs.com/'
      },
      {
        service: 'Ola',
        type: 'Auto',
        price: 90,
        eta: 4,
        deepLink: 'https://www.olacabs.com/'
      }
    ];
  } catch (error) {
    console.error('Ola API error:', error);
    return [];
  }
}

// Rapido API (Check for partner access)
async function getRapidoRides(from, to) {
  try {
    // Rapido might have partner API - contact them
    // For MVP, use mock data
    
    return [
      {
        service: 'Rapido',
        type: 'Bike',
        price: 45,
        eta: 4,
        deepLink: `https://www.rapido.bike/ride?from=${from.lat},${from.lng}&to=${to.lat},${to.lng}`
      },
      {
        service: 'Rapido',
        type: 'Auto',
        price: 75,
        eta: 5,
        deepLink: 'https://www.rapido.bike/'
      }
    ];
  } catch (error) {
    console.error('Rapido API error:', error);
    return [];
  }
}

// ============================================
// WEB SCRAPING ALTERNATIVE (Use carefully!)
// ============================================

// Example web scraping for services without APIs
// NOTE: This may violate ToS - use official APIs when possible
async function scrapeOlaPrices(from, to) {
  const puppeteer = require('puppeteer');
  
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Navigate to Ola web app
    await page.goto('https://www.olacabs.com/');
    
    // Input locations (you'll need to inspect their HTML structure)
    await page.type('#pickup-input', from.address);
    await page.type('#drop-input', to.address);
    await page.click('#search-button');
    
    // Wait for results and extract data
    await page.waitForSelector('.ride-options');
    const rides = await page.evaluate(() => {
      const rideElements = document.querySelectorAll('.ride-card');
      return Array.from(rideElements).map(el => ({
        type: el.querySelector('.ride-type').textContent,
        price: parseFloat(el.querySelector('.price').textContent.replace('₹', '')),
        eta: el.querySelector('.eta').textContent
      }));
    });
    
    await browser.close();
    return rides;
  } catch (error) {
    console.error('Scraping error:', error);
    return [];
  }
}

// ============================================
// MAIN AGGREGATION ENDPOINT
// ============================================

app.post('/api/rides/compare', async (req, res) => {
  const { from, to } = req.body;
  
  // Validate input
  if (!from || !to || !from.lat || !from.lng || !to.lat || !to.lng) {
    return res.status(400).json({ error: 'Invalid location data' });
  }

  try {
    // Fetch from all services in parallel
    const [nammaYatri, uber, ola, rapido] = await Promise.allSettled([
      getNammaYatriRides(from, to),
      getUberRides(from, to),
      getOlaRides(from, to),
      getRapidoRides(from, to)
    ]);

    // Combine all results
    const allRides = [];
    
    if (nammaYatri.status === 'fulfilled' && nammaYatri.value) {
      allRides.push(nammaYatri.value);
    }
    
    if (uber.status === 'fulfilled' && uber.value) {
      allRides.push(...uber.value);
    }
    
    if (ola.status === 'fulfilled' && ola.value) {
      allRides.push(...ola.value);
    }
    
    if (rapido.status === 'fulfilled' && rapido.value) {
      allRides.push(...rapido.value);
    }

    // Sort by price
    allRides.sort((a, b) => a.price - b.price);

    res.json({
      success: true,
      rides: allRides,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching rides:', error);
    res.status(500).json({ error: 'Failed to fetch ride data' });
  }
});

// Geocoding helper endpoint (convert address to lat/lng)
app.post('/api/geocode', async (req, res) => {
  const { address } = req.body;
  
  try {
    // Use Google Maps Geocoding API or OpenStreetMap Nominatim (free)
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'RideAggregator/1.0'
      }
    });

    if (response.data.length > 0) {
      const location = response.data[0];
      res.json({
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lon),
        address: location.display_name
      });
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: 'Geocoding failed' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Ride Aggregator API running on port ${PORT}`);
});

// ============================================
// DEPLOYMENT NOTES
// ============================================

/*
ENVIRONMENT VARIABLES (.env file):
- UBER_API_KEY=your_uber_api_key
- OLA_API_KEY=your_ola_api_key (if available)
- GOOGLE_MAPS_API_KEY=your_google_maps_key (for geocoding)
- PORT=3001

NEXT STEPS FOR PRODUCTION:
1. Add rate limiting (express-rate-limit)
2. Add caching (Redis) - cache results for 2-3 minutes per route
3. Add error logging (Winston or similar)
4. Add monitoring (New Relic, DataDog)
5. Deploy to cloud (Railway, Render, or AWS)
6. Set up CI/CD pipeline
7. Add authentication if needed (JWT)
8. Implement request logging and analytics

API ACCESS GUIDE:
1. Namma Yatri: Best starting point - open source, India-focused
   Contact: https://github.com/nammayatri/nammayatri
   
2. Uber: Apply at https://developer.uber.com/
   - Requires company details
   - Review process takes 1-2 weeks
   
3. Ola: No public API currently
   - Contact Ola corporate for partnership
   - Alternative: Careful web scraping (check ToS!)
   
4. Rapido: Contact support for API access
   - info@rapido.bike
   
5. For other countries:
   - Lyft (USA): https://developer.lyft.com
   - Grab (Southeast Asia): https://developer.grab.com
   - DiDi (China/LatAm): Contact for partnership
*/
