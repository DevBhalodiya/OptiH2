import { dataStore } from '../jobs/cronFetch.js';
import { dataFetcher } from '../services/dataFetcher.js';
import { dataCleaner } from '../services/dataCleaner.js';
import { logger } from '../services/logger.js';

/**
 * Controller for demand centers endpoints
 * Handles population, industrial, and transportation demand data
 */

/**
 * Get all demand centers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllDemandCenters = async (req, res) => {
  try {
    const { minPopulation, maxPopulation, country, demandType } = req.query;
    let demandCenters = [...dataStore.demand];

    // Filter by population range
    if (minPopulation || maxPopulation) {
      const minPop = parseInt(minPopulation) || 0;
      const maxPop = parseInt(maxPopulation) || Infinity;
      
      demandCenters = demandCenters.filter(center => {
        const population = center.population?.total || 0;
        return population >= minPop && population <= maxPop;
      });
    }

    // Filter by country
    if (country) {
      demandCenters = demandCenters.filter(center => 
        center.country?.toLowerCase() === country.toLowerCase()
      );
    }

    // Filter by demand type (industrial, transport, urban)
    if (demandType) {
      demandCenters = demandCenters.filter(center => {
        switch (demandType.toLowerCase()) {
          case 'industrial':
            return (center.industrialDemand || 0) > 0;
          case 'transport':
            return (center.transportDemand || 0) > 0;
          case 'urban':
            return (center.urbanPopulation?.total || 0) > 0;
          default:
            return true;
        }
      });
    }

    res.json({
      success: true,
      data: {
        demandCenters,
        count: demandCenters.length,
        lastUpdated: dataStore.lastUpdated.demand,
        filters: { minPopulation, maxPopulation, country, demandType }
      }
    });

    logger.info(`Retrieved ${demandCenters.length} demand centers with filters: ${JSON.stringify(req.query)}`);
  } catch (error) {
    logger.error(`Error getting demand centers: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve demand centers data'
    });
  }
};

/**
 * Get a specific demand center by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getDemandCenterById = async (req, res) => {
  try {
    const { id } = req.params;
    const demandCenter = dataStore.demand.find(d => d.id === id);

    if (!demandCenter) {
      return res.status(404).json({
        success: false,
        error: `Demand center with ID ${id} not found`
      });
    }

    res.json({
      success: true,
      data: demandCenter
    });

    logger.info(`Retrieved demand center: ${id}`);
  } catch (error) {
    logger.error(`Error getting demand center by ID: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve demand center data'
    });
  }
};

/**
 * Get demand centers statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getDemandStats = async (req, res) => {
  try {
    const demandCenters = dataStore.demand;
    
    // Calculate statistics
    const stats = {
      total: demandCenters.length,
      totalPopulation: 0,
      totalUrbanPopulation: 0,
      totalIndustrialDemand: 0,
      totalTransportDemand: 0,
      averagePopulation: 0,
      byCountry: {},
      populationDistribution: {
        small: 0,      // < 1M
        medium: 0,     // 1M-10M
        large: 0,      // 10M-50M
        megacity: 0    // > 50M
      },
      demandTypes: {
        highIndustrial: 0,    // Industrial demand > 50
        highTransport: 0,     // Transport demand > 50
        highUrban: 0,         // Urban pop > 1M
        mixed: 0              // Multiple high demand types
      }
    };

    demandCenters.forEach(center => {
      const population = center.population?.total || 0;
      const urbanPop = center.urbanPopulation?.total || 0;
      const industrialDemand = center.industrialDemand || 0;
      const transportDemand = center.transportDemand || 0;
      const country = center.country || 'Unknown';

      // Accumulate totals
      stats.totalPopulation += population;
      stats.totalUrbanPopulation += urbanPop;
      stats.totalIndustrialDemand += industrialDemand;
      stats.totalTransportDemand += transportDemand;

      // Count by country
      stats.byCountry[country] = (stats.byCountry[country] || 0) + 1;

      // Population distribution
      if (population < 1000000) stats.populationDistribution.small++;
      else if (population < 10000000) stats.populationDistribution.medium++;
      else if (population < 50000000) stats.populationDistribution.large++;
      else stats.populationDistribution.megacity++;

      // Demand type analysis
      let demandTypeCount = 0;
      if (industrialDemand > 50) {
        stats.demandTypes.highIndustrial++;
        demandTypeCount++;
      }
      if (transportDemand > 50) {
        stats.demandTypes.highTransport++;
        demandTypeCount++;
      }
      if (urbanPop > 1000000) {
        stats.demandTypes.highUrban++;
        demandTypeCount++;
      }
      if (demandTypeCount > 1) {
        stats.demandTypes.mixed++;
      }
    });

    stats.averagePopulation = demandCenters.length > 0 ? 
      stats.totalPopulation / demandCenters.length : 0;

    res.json({
      success: true,
      data: {
        statistics: stats,
        lastUpdated: dataStore.lastUpdated.demand,
        generatedAt: new Date().toISOString()
      }
    });

    logger.info('Generated demand centers statistics');
  } catch (error) {
    logger.error(`Error generating demand stats: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to generate demand statistics'
    });
  }
};

/**
 * Get top demand centers by criteria
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getTopDemandCenters = async (req, res) => {
  try {
    const { criteria, limit } = req.query;
    const maxResults = parseInt(limit) || 10;
    
    let demandCenters = [...dataStore.demand];
    let sortedCenters;

    switch (criteria) {
      case 'population':
        sortedCenters = demandCenters.sort((a, b) => 
          (b.population?.total || 0) - (a.population?.total || 0)
        );
        break;
      case 'industrial':
        sortedCenters = demandCenters.sort((a, b) => 
          (b.industrialDemand || 0) - (a.industrialDemand || 0)
        );
        break;
      case 'transport':
        sortedCenters = demandCenters.sort((a, b) => 
          (b.transportDemand || 0) - (a.transportDemand || 0)
        );
        break;
      case 'urban':
        sortedCenters = demandCenters.sort((a, b) => 
          (b.urbanPopulation?.total || 0) - (a.urbanPopulation?.total || 0)
        );
        break;
      case 'combined':
      default:
        // Combined demand score
        sortedCenters = demandCenters.map(center => ({
          ...center,
          combinedScore: (
            (center.population?.total || 0) * 0.0001 +
            (center.industrialDemand || 0) * 2 +
            (center.transportDemand || 0) * 1.5 +
            (center.urbanPopulation?.total || 0) * 0.0002
          )
        })).sort((a, b) => b.combinedScore - a.combinedScore);
        break;
    }

    const topCenters = sortedCenters.slice(0, maxResults).map((center, index) => ({
      rank: index + 1,
      ...center
    }));

    res.json({
      success: true,
      data: {
        topDemandCenters: topCenters,
        count: topCenters.length,
        criteria: criteria || 'combined',
        lastUpdated: dataStore.lastUpdated.demand
      }
    });

    logger.info(`Retrieved ${topCenters.length} top demand centers by criteria: ${criteria || 'combined'}`);
  } catch (error) {
    logger.error(`Error getting top demand centers: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve top demand centers'
    });
  }
};

/**
 * Get demand centers within radius of a location
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getDemandCentersNearby = async (req, res) => {
  try {
    const { lat, lon, radius } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const searchRadius = parseFloat(radius) || 200; // Default 200km radius

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid latitude or longitude provided'
      });
    }

    // Find demand centers within radius
    const nearbyDemandCenters = dataStore.demand
      .map(center => {
        const distance = dataCleaner.haversineDistance(
          latitude,
          longitude,
          center.location.latitude,
          center.location.longitude
        );
        return { ...center, distance };
      })
      .filter(center => center.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance); // Sort by distance

    res.json({
      success: true,
      data: {
        demandCenters: nearbyDemandCenters,
        count: nearbyDemandCenters.length,
        searchLocation: { latitude, longitude },
        searchRadius,
        lastUpdated: dataStore.lastUpdated.demand
      }
    });

    logger.info(`Found ${nearbyDemandCenters.length} demand centers within ${searchRadius}km of ${latitude}, ${longitude}`);
  } catch (error) {
    logger.error(`Error getting nearby demand centers: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve nearby demand centers'
    });
  }
};

/**
 * Refresh demand centers data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const refreshDemandData = async (req, res) => {
  try {
    const { countries } = req.body;
    
    // Use provided countries or default list
    const targetCountries = countries || ['US', 'CA', 'MX', 'DE', 'FR', 'GB', 'JP'];
    
    const demandDataPoints = [];
    const errors = [];

    for (const countryCode of targetCountries) {
      try {
        // Fetch population data
        const populationData = await dataFetcher.fetchPopulationData(countryCode);
        const cleanedPopulation = dataCleaner.cleanPopulationData(populationData, countryCode);

        // Fetch urban population data
        const urbanData = await dataFetcher.fetchUrbanPopulationData(countryCode);
        const cleanedUrban = dataCleaner.cleanPopulationData(urbanData, countryCode);

        // Get country coordinates for industrial area search
        const countryCoords = getCountryCoordinates(countryCode);
        if (countryCoords) {
          // Fetch industrial areas
          const industrialData = await dataFetcher.fetchIndustrialAreas(
            countryCoords.lat - 2,
            countryCoords.lon - 2,
            countryCoords.lat + 2,
            countryCoords.lon + 2
          );
          
          const cleanedIndustrial = dataCleaner.cleanInfrastructureData(industrialData, 'demand');

          // Create demand center entry
          demandDataPoints.push({
            id: `demand_${countryCode.toLowerCase()}`,
            name: cleanedPopulation.country.name,
            country: countryCode,
            location: {
              latitude: countryCoords.lat,
              longitude: countryCoords.lon
            },
            population: cleanedPopulation.population,
            urbanPopulation: cleanedUrban.population,
            industrialAreas: cleanedIndustrial.length,
            industrialDemand: cleanedIndustrial.length * 10, // Simplified calculation
            transportDemand: cleanedPopulation.population.total * 0.0001, // Simplified calculation
            lastUpdated: new Date().toISOString()
          });
        }

        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 600));

      } catch (countryError) {
        errors.push({
          country: countryCode,
          error: countryError.message
        });
        logger.warn(`Failed to refresh demand data for ${countryCode}: ${countryError.message}`);
      }
    }

    // Update data store
    dataStore.demand = demandDataPoints;
    dataStore.lastUpdated.demand = new Date().toISOString();

    res.json({
      success: true,
      data: {
        demandCenters: demandDataPoints,
        count: demandDataPoints.length,
        errors,
        refreshedAt: dataStore.lastUpdated.demand
      }
    });

    logger.info(`Refreshed demand data: ${demandDataPoints.length} centers, ${errors.length} errors`);

    // Emit update to connected clients
    if (global.io) {
      global.io.to('demand-updates').emit('demand-refreshed', {
        count: demandDataPoints.length,
        timestamp: dataStore.lastUpdated.demand
      });
    }

  } catch (error) {
    logger.error(`Error refreshing demand data: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh demand centers data'
    });
  }
};

/**
 * Get demand forecast for a specific area
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getDemandForecast = async (req, res) => {
  try {
    const { lat, lon, radius, years } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const searchRadius = parseFloat(radius) || 200;
    const forecastYears = parseInt(years) || 10;

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinates provided'
      });
    }

    // Find nearby demand centers
    const nearbyDemandCenters = dataStore.demand.filter(center => {
      const distance = dataCleaner.haversineDistance(
        latitude,
        longitude,
        center.location.latitude,
        center.location.longitude
      );
      return distance <= searchRadius;
    });

    // Calculate demand forecast (simplified growth model)
    const baseYear = new Date().getFullYear();
    const forecast = [];

    for (let year = 0; year <= forecastYears; year++) {
      const targetYear = baseYear + year;
      
      // Simplified growth rates
      const populationGrowthRate = 0.01; // 1% annual population growth
      const industrialGrowthRate = 0.03; // 3% annual industrial growth
      const transportGrowthRate = 0.05; // 5% annual transport demand growth
      
      let totalPopulation = 0;
      let totalIndustrialDemand = 0;
      let totalTransportDemand = 0;

      nearbyDemandCenters.forEach(center => {
        const populationMultiplier = Math.pow(1 + populationGrowthRate, year);
        const industrialMultiplier = Math.pow(1 + industrialGrowthRate, year);
        const transportMultiplier = Math.pow(1 + transportGrowthRate, year);

        totalPopulation += (center.population?.total || 0) * populationMultiplier;
        totalIndustrialDemand += (center.industrialDemand || 0) * industrialMultiplier;
        totalTransportDemand += (center.transportDemand || 0) * transportMultiplier;
      });

      // Estimate hydrogen demand (simplified)
      const hydrogenDemand = (
        totalPopulation * 0.001 + // kg H2 per person per year
        totalIndustrialDemand * 10 + // kg H2 per industrial unit
        totalTransportDemand * 5 // kg H2 per transport unit
      );

      forecast.push({
        year: targetYear,
        population: Math.round(totalPopulation),
        industrialDemand: Math.round(totalIndustrialDemand),
        transportDemand: Math.round(totalTransportDemand),
        estimatedHydrogenDemand: Math.round(hydrogenDemand), // kg per year
        estimatedHydrogenDemandTonnes: Math.round(hydrogenDemand / 1000) // tonnes per year
      });
    }

    res.json({
      success: true,
      data: {
        forecast,
        forecastParameters: {
          location: { latitude, longitude },
          radius: searchRadius,
          years: forecastYears,
          nearbyDemandCenters: nearbyDemandCenters.length
        },
        lastUpdated: dataStore.lastUpdated.demand,
        generatedAt: new Date().toISOString()
      }
    });

    logger.info(`Generated demand forecast for ${latitude}, ${longitude} over ${forecastYears} years`);
  } catch (error) {
    logger.error(`Error generating demand forecast: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to generate demand forecast'
    });
  }
};

/**
 * Get approximate coordinates for country codes
 * @param {string} countryCode - ISO country code
 * @returns {Object|null} Coordinates object or null
 */
function getCountryCoordinates(countryCode) {
  const coordinates = {
    'US': { lat: 39.8283, lon: -98.5795 },
    'CA': { lat: 56.1304, lon: -106.3468 },
    'MX': { lat: 23.6345, lon: -102.5528 },
    'DE': { lat: 51.1657, lon: 10.4515 },
    'FR': { lat: 46.6034, lon: 1.8883 },
    'GB': { lat: 55.3781, lon: -3.4360 },
    'JP': { lat: 36.2048, lon: 138.2529 },
    'CN': { lat: 35.8617, lon: 104.1954 },
    'IN': { lat: 20.5937, lon: 78.9629 },
    'BR': { lat: -14.2350, lon: -51.9253 }
  };
  
  return coordinates[countryCode] || null;
}
