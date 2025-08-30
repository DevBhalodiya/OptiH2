import { dataStore } from '../jobs/cronFetch.js';
import { dataFetcher } from '../services/dataFetcher.js';
import { dataCleaner } from '../services/dataCleaner.js';
import { logger } from '../services/logger.js';

/**
 * Controller for renewable energy data endpoints
 * Handles solar and wind resource data from various APIs
 */

/**
 * Get all renewable energy data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllRenewables = async (req, res) => {
  try {
    const { type, minScore, maxScore } = req.query;
    let renewables = [...dataStore.renewables];

    // Filter by renewable type if provided
    if (type && (type === 'solar' || type === 'wind')) {
      renewables = renewables.filter(renewable => {
        if (type === 'solar') {
          return renewable.solar && renewable.solar.suitabilityScore > 0;
        } else if (type === 'wind') {
          return renewable.wind && renewable.wind.suitabilityScore > 0;
        }
        return true;
      });
    }

    // Filter by suitability score range
    if (minScore || maxScore) {
      const minScoreVal = parseFloat(minScore) || 0;
      const maxScoreVal = parseFloat(maxScore) || 100;
      
      renewables = renewables.filter(renewable => {
        const solarScore = renewable.solar?.suitabilityScore || 0;
        const windScore = renewable.wind?.suitabilityScore || 0;
        const maxResourceScore = Math.max(solarScore, windScore);
        
        return maxResourceScore >= minScoreVal && maxResourceScore <= maxScoreVal;
      });
    }

    res.json({
      success: true,
      data: {
        renewables,
        count: renewables.length,
        lastUpdated: dataStore.lastUpdated.renewables,
        filters: { type, minScore, maxScore }
      }
    });

    logger.info(`Retrieved ${renewables.length} renewable energy data points with filters: ${JSON.stringify(req.query)}`);
  } catch (error) {
    logger.error(`Error getting renewables: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve renewable energy data'
    });
  }
};

/**
 * Get solar irradiance data for specific location
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getSolarData = async (req, res) => {
  try {
    const { lat, lon, startDate, endDate } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid latitude or longitude provided'
      });
    }

    // Check if we have cached data for this location
    const existingData = dataStore.renewables.find(renewable => 
      Math.abs(renewable.location.latitude - latitude) < 0.1 &&
      Math.abs(renewable.location.longitude - longitude) < 0.1
    );

    if (existingData) {
      res.json({
        success: true,
        data: {
          location: { latitude, longitude },
          solar: existingData.solar,
          weather: existingData.weather,
          lastUpdated: existingData.lastUpdated,
          source: 'cache'
        }
      });
      return;
    }

    // Fetch fresh solar data
    const solarData = await dataFetcher.fetchSolarData(latitude, longitude, startDate, endDate);
    const cleanedSolar = dataCleaner.cleanSolarData(solarData, latitude, longitude);

    res.json({
      success: true,
      data: {
        ...cleanedSolar,
        source: 'fresh'
      }
    });

    logger.info(`Fetched solar data for coordinates: ${latitude}, ${longitude}`);
  } catch (error) {
    logger.error(`Error getting solar data: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve solar data'
    });
  }
};

/**
 * Get wind data for specific location
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getWindData = async (req, res) => {
  try {
    const { lat, lon, forecast } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid latitude or longitude provided'
      });
    }

    // Check if we have cached data for this location
    const existingData = dataStore.renewables.find(renewable => 
      Math.abs(renewable.location.latitude - latitude) < 0.1 &&
      Math.abs(renewable.location.longitude - longitude) < 0.1
    );

    if (existingData && !forecast) {
      res.json({
        success: true,
        data: {
          location: { latitude, longitude },
          wind: existingData.wind,
          weather: existingData.weather,
          lastUpdated: existingData.lastUpdated,
          source: 'cache'
        }
      });
      return;
    }

    // Fetch fresh wind data
    let windData;
    if (forecast === 'true') {
      windData = await dataFetcher.fetchWindForecast(latitude, longitude);
      const cleanedWind = dataCleaner.cleanWindForecastData(windData);
      
      res.json({
        success: true,
        data: {
          ...cleanedWind,
          source: 'fresh_forecast'
        }
      });
    } else {
      windData = await dataFetcher.fetchWindData(latitude, longitude);
      const cleanedWind = dataCleaner.cleanWindData(windData);
      
      res.json({
        success: true,
        data: {
          ...cleanedWind,
          source: 'fresh'
        }
      });
    }

    logger.info(`Fetched wind data for coordinates: ${latitude}, ${longitude}, forecast: ${forecast}`);
  } catch (error) {
    logger.error(`Error getting wind data: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve wind data'
    });
  }
};

/**
 * Get renewable energy statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getRenewablesStats = async (req, res) => {
  try {
    const renewables = dataStore.renewables;
    
    // Calculate statistics
    const stats = {
      total: renewables.length,
      solar: {
        averageIrradiance: 0,
        averageSuitability: 0,
        excellent: 0,  // > 80 score
        good: 0,       // 60-80 score
        fair: 0,       // 40-60 score
        poor: 0        // < 40 score
      },
      wind: {
        averageSpeed: 0,
        averageSuitability: 0,
        excellent: 0,  // > 80 score
        good: 0,       // 60-80 score
        fair: 0,       // 40-60 score
        poor: 0        // < 40 score
      },
      combined: {
        excellentBoth: 0,
        goodCombined: 0,
        renewablePotential: 0
      }
    };

    let totalSolarIrradiance = 0;
    let totalSolarSuitability = 0;
    let totalWindSpeed = 0;
    let totalWindSuitability = 0;
    let solarCount = 0;
    let windCount = 0;

    renewables.forEach(renewable => {
      // Solar statistics
      if (renewable.solar) {
        const solarScore = renewable.solar.suitabilityScore || 0;
        const irradiance = renewable.solar.averageIrradiance || 0;
        
        totalSolarIrradiance += irradiance;
        totalSolarSuitability += solarScore;
        solarCount++;

        if (solarScore >= 80) stats.solar.excellent++;
        else if (solarScore >= 60) stats.solar.good++;
        else if (solarScore >= 40) stats.solar.fair++;
        else stats.solar.poor++;
      }

      // Wind statistics
      if (renewable.wind) {
        const windScore = renewable.wind.suitabilityScore || 0;
        const windSpeed = renewable.wind.speed || 0;
        
        totalWindSpeed += windSpeed;
        totalWindSuitability += windScore;
        windCount++;

        if (windScore >= 80) stats.wind.excellent++;
        else if (windScore >= 60) stats.wind.good++;
        else if (windScore >= 40) stats.wind.fair++;
        else stats.wind.poor++;
      }

      // Combined statistics
      const solarScore = renewable.solar?.suitabilityScore || 0;
      const windScore = renewable.wind?.suitabilityScore || 0;
      
      if (solarScore >= 80 && windScore >= 80) {
        stats.combined.excellentBoth++;
      } else if (solarScore >= 60 || windScore >= 60) {
        stats.combined.goodCombined++;
      }

      // Overall renewable potential
      const maxScore = Math.max(solarScore, windScore);
      stats.combined.renewablePotential += maxScore;
    });

    // Calculate averages
    stats.solar.averageIrradiance = solarCount > 0 ? totalSolarIrradiance / solarCount : 0;
    stats.solar.averageSuitability = solarCount > 0 ? totalSolarSuitability / solarCount : 0;
    stats.wind.averageSpeed = windCount > 0 ? totalWindSpeed / windCount : 0;
    stats.wind.averageSuitability = windCount > 0 ? totalWindSuitability / windCount : 0;
    stats.combined.renewablePotential = renewables.length > 0 ? 
      stats.combined.renewablePotential / renewables.length : 0;

    res.json({
      success: true,
      data: {
        statistics: stats,
        lastUpdated: dataStore.lastUpdated.renewables,
        generatedAt: new Date().toISOString()
      }
    });

    logger.info('Generated renewable energy statistics');
  } catch (error) {
    logger.error(`Error generating renewables stats: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to generate renewable energy statistics'
    });
  }
};

/**
 * Get best renewable locations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getBestRenewableLocations = async (req, res) => {
  try {
    const { type, limit } = req.query;
    const maxResults = parseInt(limit) || 10;
    
    let renewables = [...dataStore.renewables];

    // Sort by renewable potential
    if (type === 'solar') {
      renewables.sort((a, b) => 
        (b.solar?.suitabilityScore || 0) - (a.solar?.suitabilityScore || 0)
      );
    } else if (type === 'wind') {
      renewables.sort((a, b) => 
        (b.wind?.suitabilityScore || 0) - (a.wind?.suitabilityScore || 0)
      );
    } else {
      // Combined renewable potential
      renewables.sort((a, b) => {
        const aMax = Math.max(a.solar?.suitabilityScore || 0, a.wind?.suitabilityScore || 0);
        const bMax = Math.max(b.solar?.suitabilityScore || 0, b.wind?.suitabilityScore || 0);
        return bMax - aMax;
      });
    }

    const bestLocations = renewables.slice(0, maxResults).map((location, index) => ({
      rank: index + 1,
      ...location,
      overallScore: type === 'solar' ? location.solar?.suitabilityScore :
                   type === 'wind' ? location.wind?.suitabilityScore :
                   Math.max(location.solar?.suitabilityScore || 0, location.wind?.suitabilityScore || 0)
    }));

    res.json({
      success: true,
      data: {
        bestLocations,
        count: bestLocations.length,
        criteria: type || 'combined',
        lastUpdated: dataStore.lastUpdated.renewables
      }
    });

    logger.info(`Retrieved ${bestLocations.length} best renewable locations for type: ${type || 'combined'}`);
  } catch (error) {
    logger.error(`Error getting best renewable locations: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve best renewable locations'
    });
  }
};

/**
 * Refresh renewable data for all locations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const refreshRenewablesData = async (req, res) => {
  try {
    const { locations } = req.body;
    
    // Use provided locations or default major cities
    const targetLocations = locations || [
      { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
      { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
      { name: 'Houston', lat: 29.7604, lon: -95.3698 },
      { name: 'Phoenix', lat: 33.4484, lon: -112.0740 },
      { name: 'Denver', lat: 39.7392, lon: -104.9903 }
    ];

    const renewableDataPoints = [];
    const errors = [];

    for (const location of targetLocations) {
      try {
        // Fetch solar data
        const solarData = await dataFetcher.fetchSolarData(location.lat, location.lon);
        const cleanedSolar = dataCleaner.cleanSolarData(solarData, location.lat, location.lon);

        // Fetch wind data
        const windData = await dataFetcher.fetchWindData(location.lat, location.lon);
        const cleanedWind = dataCleaner.cleanWindData(windData);

        // Combine renewable data
        renewableDataPoints.push({
          id: `renewable_${location.name.toLowerCase().replace(/\s+/g, '_')}`,
          name: location.name,
          location: {
            latitude: location.lat,
            longitude: location.lon
          },
          solar: cleanedSolar.solar,
          wind: cleanedWind.wind,
          weather: {
            ...cleanedSolar.weather,
            ...cleanedWind.weather
          },
          lastUpdated: new Date().toISOString()
        });

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (locationError) {
        errors.push({
          location: location.name,
          error: locationError.message
        });
        logger.warn(`Failed to refresh renewable data for ${location.name}: ${locationError.message}`);
      }
    }

    // Update data store with new data
    dataStore.renewables = renewableDataPoints;
    dataStore.lastUpdated.renewables = new Date().toISOString();

    res.json({
      success: true,
      data: {
        renewables: renewableDataPoints,
        count: renewableDataPoints.length,
        errors,
        refreshedAt: dataStore.lastUpdated.renewables
      }
    });

    logger.info(`Refreshed renewable data: ${renewableDataPoints.length} locations, ${errors.length} errors`);

    // Emit update to connected clients
    if (global.io) {
      global.io.to('renewable-updates').emit('renewables-refreshed', {
        count: renewableDataPoints.length,
        timestamp: dataStore.lastUpdated.renewables
      });
    }

  } catch (error) {
    logger.error(`Error refreshing renewables data: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh renewable energy data'
    });
  }
};
