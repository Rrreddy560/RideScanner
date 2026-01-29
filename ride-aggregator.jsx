import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, DollarSign, Zap, ArrowRight, Car, Bike, Users } from 'lucide-react';

// Mock data for demonstration - will be replaced with real API calls
const MOCK_RIDES = [
  {
    id: 1,
    service: 'Ola',
    type: 'Mini',
    price: 180,
    eta: '3 min',
    icon: '🚗',
    color: 'from-green-400 to-green-600',
    deepLink: 'https://www.olacabs.com/',
    isCheapest: true
  },
  {
    id: 2,
    service: 'Uber',
    type: 'UberGo',
    price: 195,
    eta: '2 min',
    icon: '🚕',
    color: 'from-black to-gray-800',
    deepLink: 'https://www.uber.com/',
    isFastest: true
  },
  {
    id: 3,
    service: 'Rapido',
    type: 'Bike',
    price: 45,
    eta: '4 min',
    icon: '🏍️',
    color: 'from-yellow-400 to-orange-500',
    deepLink: 'https://www.rapido.bike/',
    isCheapest: true
  },
  {
    id: 4,
    service: 'Namma Yatri',
    type: 'Auto',
    price: 85,
    eta: '5 min',
    icon: '🛺',
    color: 'from-blue-400 to-blue-600',
    deepLink: 'https://nammayatri.in/'
  },
  {
    id: 5,
    service: 'Uber',
    type: 'Auto',
    price: 92,
    eta: '3 min',
    icon: '🛺',
    color: 'from-black to-gray-800',
    deepLink: 'https://www.uber.com/'
  }
];

const RideAggregator = () => {
  const [stage, setStage] = useState('input'); // 'input' or 'results'
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animateResults, setAnimateResults] = useState(false);

  // Simulate fetching current location
  const getCurrentLocation = () => {
    setFromLocation('Current Location');
    // In real app: use navigator.geolocation
  };

  const searchRides = async () => {
    if (!fromLocation || !toLocation) {
      alert('Please enter both locations');
      return;
    }

    setLoading(true);
    setStage('results');
    
    // Simulate API calls
    setTimeout(() => {
      setRides(MOCK_RIDES);
      setLoading(false);
      setAnimateResults(true);
    }, 1500);
  };

  const handleBookRide = (ride) => {
    // In production, construct proper deep links with location params
    window.open(ride.deepLink, '_blank');
  };

  const resetSearch = () => {
    setStage('input');
    setRides([]);
    setAnimateResults(false);
    setFromLocation('');
    setToLocation('');
  };

  // Find cheapest and fastest
  const cheapestPrice = rides.length > 0 ? Math.min(...rides.map(r => r.price)) : 0;
  const fastestEta = rides.length > 0 ? Math.min(...rides.map(r => parseInt(r.eta))) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
              R
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">RideCompare</h1>
              <p className="text-xs text-gray-500">Find your best ride</p>
            </div>
          </div>
          {stage === 'results' && (
            <button
              onClick={resetSearch}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              New Search
            </button>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Input Stage */}
        {stage === 'input' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-3">
                Compare All Your Rides
              </h2>
              <p className="text-lg text-gray-600">
                One search, all options. Find the best ride in seconds.
              </p>
            </div>

            {/* Location Inputs */}
            <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6 border border-gray-100">
              {/* From Location */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                  📍 Pickup Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 w-5 h-5" />
                  <input
                    type="text"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    placeholder="Enter pickup location"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg transition-colors"
                  />
                  <button
                    onClick={getCurrentLocation}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                  >
                    <Navigation className="w-4 h-4 text-purple-600" />
                  </button>
                </div>
              </div>

              {/* Swap Animation Divider */}
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                  <ArrowRight className="w-6 h-6 text-white transform rotate-90" />
                </div>
              </div>

              {/* To Location */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                  🎯 Drop-off Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500 w-5 h-5" />
                  <input
                    type="text"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="Where to?"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none text-lg transition-colors"
                  />
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={searchRides}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-5 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Search Rides
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-sm font-semibold text-gray-800">Lightning Fast</div>
                <div className="text-xs text-gray-500 mt-1">Compare in seconds</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-sm font-semibold text-gray-800">Best Prices</div>
                <div className="text-xs text-gray-500 mt-1">Always save money</div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-sm font-semibold text-gray-800">All Services</div>
                <div className="text-xs text-gray-500 mt-1">Uber, Ola & more</div>
              </div>
            </div>
          </div>
        )}

        {/* Results Stage */}
        {stage === 'results' && (
          <div className="space-y-6">
            {/* Route Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm text-gray-500">From</div>
                  <div className="font-semibold text-gray-800">{fromLocation}</div>
                </div>
                <ArrowRight className="text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">To</div>
                  <div className="font-semibold text-gray-800">{toLocation}</div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 font-medium">Finding best rides...</p>
              </div>
            )}

            {/* Ride Cards */}
            {!loading && rides.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Available Rides ({rides.length})
                </h3>
                {rides.map((ride, index) => {
                  const isCheapest = ride.price === cheapestPrice;
                  const isFastest = parseInt(ride.eta) === fastestEta;
                  
                  return (
                    <div
                      key={ride.id}
                      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-300 overflow-hidden ${
                        animateResults ? 'animate-slideUp' : ''
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      {/* Badge Row */}
                      <div className="px-6 pt-4 flex gap-2">
                        {isCheapest && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            💰 CHEAPEST
                          </span>
                        )}
                        {isFastest && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                            ⚡ FASTEST
                          </span>
                        )}
                      </div>

                      <div className="p-6 flex items-center gap-4">
                        {/* Service Icon */}
                        <div className={`w-16 h-16 bg-gradient-to-br ${ride.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0`}>
                          {ride.icon}
                        </div>

                        {/* Ride Info */}
                        <div className="flex-1">
                          <div className="font-bold text-lg text-gray-800">{ride.service}</div>
                          <div className="text-sm text-gray-500">{ride.type}</div>
                          
                          <div className="flex gap-4 mt-2">
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-700">{ride.eta}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price and Book Button */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-800">₹{ride.price}</div>
                          <button
                            onClick={() => handleBookRide(ride)}
                            className={`mt-2 px-6 py-3 bg-gradient-to-r ${ride.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2`}
                          >
                            Book Now
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
        }

        input::placeholder {
          color: #9CA3AF;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default RideAggregator;
