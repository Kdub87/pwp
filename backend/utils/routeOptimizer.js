const axios = require('axios');

/**
 * Optimize route using OpenRouteService API
 * @param {Object} pickup - Pickup coordinates {lat: Number, lng: Number}
 * @param {Object} delivery - Delivery coordinates {lat: Number, lng: Number}
 * @returns {Promise<Object>} Route optimization result
 */
async function optimizeRoute(pickup, delivery) {
  try {
    if (!process.env.OPENROUTESERVICE_API_KEY) {
      console.warn('OpenRouteService API key not configured');
      return { distance: 0, duration: 0, route: [] };
    }

    const response = await axios.get('https://api.openrouteservice.org/v2/directions/driving-hgv', {
      params: {
        api_key: process.env.OPENROUTESERVICE_API_KEY,
        start: `${pickup.lng},${pickup.lat}`,
        end: `${delivery.lng},${delivery.lat}`
      },
      timeout: 10000 // 10 second timeout
    });

    const route = response.data.features[0];
    if (!route) {
      throw new Error('No route found');
    }

    // Convert meters to miles and seconds to hours
    const distanceMiles = route.properties.segments[0].distance / 1609.34;
    const durationHours = route.properties.segments[0].duration / 3600;

    return {
      distance: Math.round(distanceMiles * 10) / 10,
      duration: Math.round(durationHours * 10) / 10,
      route: route.geometry.coordinates
    };
  } catch (error) {
    console.error('Route optimization error:', error.message);
    // Return fallback values
    return { distance: 0, duration: 0, route: [] };
  }
}

/**
 * Geocode location string to coordinates
 * @param {string} location - Location string
 * @returns {Promise<Object>} Coordinates {lat: Number, lng: Number}
 */
async function geocodeLocation(location) {
  try {
    if (!process.env.OPENROUTESERVICE_API_KEY) {
      throw new Error('OpenRouteService API key not configured');
    }

    const response = await axios.get('https://api.openrouteservice.org/geocode/search', {
      params: {
        api_key: process.env.OPENROUTESERVICE_API_KEY,
        text: location,
        size: 1
      },
      timeout: 10000
    });

    if (!response.data.features || response.data.features.length === 0) {
      throw new Error('Location not found');
    }

    const coordinates = response.data.features[0].geometry.coordinates;
    return { lng: coordinates[0], lat: coordinates[1] };
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw error;
  }
}

module.exports = { optimizeRoute, geocodeLocation };