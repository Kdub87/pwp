const axios = require('axios');

/**
 * Calculate route distance and duration between two locations using OpenRouteService API
 * @param {string} origin - Origin location (e.g., "Chicago, IL")
 * @param {string} destination - Destination location (e.g., "Dallas, TX")
 * @returns {Promise<{distance: number, duration: number}>} - Distance in miles and duration in hours
 */
const calculateRoute = async (origin, destination) => {
  try {
    if (!process.env.OPENROUTESERVICE_API_KEY) {
      throw new Error('OpenRouteService API key not configured');
    }

    // Geocode origin and destination to coordinates
    const originCoords = await geocodeLocation(origin);
    const destinationCoords = await geocodeLocation(destination);

    // Calculate route using OpenRouteService Directions API
    const response = await axios.get('https://api.openrouteservice.org/v2/directions/driving-hgv', {
      params: {
        api_key: process.env.OPENROUTESERVICE_API_KEY,
        start: `${originCoords.lng},${originCoords.lat}`,
        end: `${destinationCoords.lng},${destinationCoords.lat}`
      }
    });

    const route = response.data.features[0];
    
    // Convert meters to miles and seconds to hours
    const distanceMiles = route.properties.segments[0].distance / 1609.34;
    const durationHours = route.properties.segments[0].duration / 3600;

    return {
      distance: Math.round(distanceMiles * 10) / 10, // Round to 1 decimal place
      duration: Math.round(durationHours * 10) / 10  // Round to 1 decimal place
    };
  } catch (error) {
    console.error('Route calculation error:', error.message);
    // Return estimated values if API fails
    return { distance: 0, duration: 0 };
  }
};

/**
 * Geocode a location string to coordinates using OpenRouteService Geocoding API
 * @param {string} location - Location string (e.g., "Chicago, IL")
 * @returns {Promise<{lat: number, lng: number}>} - Latitude and longitude
 */
const geocodeLocation = async (location) => {
  try {
    const response = await axios.get('https://api.openrouteservice.org/geocode/search', {
      params: {
        api_key: process.env.OPENROUTESERVICE_API_KEY,
        text: location,
        size: 1
      }
    });

    const coordinates = response.data.features[0].geometry.coordinates;
    return { lng: coordinates[0], lat: coordinates[1] };
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw new Error(`Failed to geocode location: ${location}`);
  }
};

module.exports = { calculateRoute };