import { dataStore } from '../jobs/cronFetch.js';
import { dataFetcher } from '../services/dataFetcher.js';
import { dataCleaner } from '../services/dataCleaner.js';
import { logger } from '../services/logger.js';

/**
 * Controller for hydrogen plants endpoints
 * Handles CRUD operations and data retrieval for hydrogen production facilities
 */

/**
 * Get all hydrogen plants
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllPlants = async (req, res) => {
  try {
    const { lat, lon, radius, type, status } = req.query;
    let plants = [...dataStore.plants];

    // Filter by location if coordinates provided
    if (lat && lon) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);
      const searchRadius = parseFloat(radius) || 100; // Default 100km radius

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid latitude or longitude provided'
        });
      }

      plants = plants.filter(plant => {
        const plantLat = plant.geometry?.coordinates?.[1] || 0;
        const plantLon = plant.geometry?.coordinates?.[0] || 0;
        const distance = dataCleaner.haversineDistance(latitude, longitude, plantLat, plantLon);
        return distance <= searchRadius;
      });
    }

    // Filter by type if provided
    if (type) {
      plants = plants.filter(plant => 
        plant.properties?.operationalType?.toLowerCase().includes(type.toLowerCase())
      );
    }

    // Filter by status if provided
    if (status) {
      plants = plants.filter(plant => 
        plant.properties?.status?.toLowerCase() === status.toLowerCase()
      );
    }

    res.json({
      success: true,
      data: {
        plants,
        count: plants.length,
        lastUpdated: dataStore.lastUpdated.plants,
        filters: { lat, lon, radius, type, status }
      }
    });

    logger.info(`Retrieved ${plants.length} plants with filters: ${JSON.stringify(req.query)}`);
  } catch (error) {
    logger.error(`Error getting plants: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve plants data'
    });
  }
};

/**
 * Get a specific plant by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPlantById = async (req, res) => {
  try {
    const { id } = req.params;
    const plant = dataStore.plants.find(p => p.id === id);

    if (!plant) {
      return res.status(404).json({
        success: false,
        error: `Plant with ID ${id} not found`
      });
    }

    res.json({
      success: true,
      data: plant
    });

    logger.info(`Retrieved plant: ${id}`);
  } catch (error) {
    logger.error(`Error getting plant by ID: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve plant data'
    });
  }
};

/**
 * Get plants statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPlantsStats = async (req, res) => {
  try {
    const plants = dataStore.plants;
    
    // Calculate statistics
    const stats = {
      total: plants.length,
      byStatus: {},
      byType: {},
      totalCapacity: 0,
      averageCapacity: 0,
      geographicDistribution: {
        northern: 0,
        southern: 0,
        eastern: 0,
        western: 0
      }
    };

    plants.forEach(plant => {
      const status = plant.properties?.status || 'unknown';
      const type = plant.properties?.operationalType || 'unknown';
      const capacity = plant.properties?.capacity || 0;
      const lat = plant.geometry?.coordinates?.[1] || 0;
      const lon = plant.geometry?.coordinates?.[0] || 0;

      // Count by status
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

      // Count by type
      stats.byType[type] = (stats.byType[type] || 0) + 1;

      // Sum capacity
      stats.totalCapacity += capacity;

      // Geographic distribution (simplified)
      if (lat > 40) stats.geographicDistribution.northern++;
      else stats.geographicDistribution.southern++;
      
      if (lon > -100) stats.geographicDistribution.eastern++;
      else stats.geographicDistribution.western++;
    });

    stats.averageCapacity = plants.length > 0 ? stats.totalCapacity / plants.length : 0;

    res.json({
      success: true,
      data: {
        statistics: stats,
        lastUpdated: dataStore.lastUpdated.plants,
        generatedAt: new Date().toISOString()
      }
    });

    logger.info('Generated plants statistics');
  } catch (error) {
    logger.error(`Error generating plants stats: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to generate plants statistics'
    });
  }
};

/**
 * Refresh plants data from external sources
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const refreshPlantsData = async (req, res) => {
  try {
    const { bbox } = req.body;
    
    let boundingBox;
    if (bbox) {
      const { south, west, north, east } = bbox;
      if (typeof south !== 'number' || typeof west !== 'number' || 
          typeof north !== 'number' || typeof east !== 'number') {
        return res.status(400).json({
          success: false,
          error: 'Invalid bounding box coordinates'
        });
      }
      boundingBox = { south, west, north, east };
    } else {
      // Default North America
      boundingBox = { south: 25.0, west: -125.0, north: 55.0, east: -65.0 };
    }

    // Fetch fresh data
    const hydrogenData = await dataFetcher.fetchHydrogenInfrastructure(
      boundingBox.south,
      boundingBox.west,
      boundingBox.north,
      boundingBox.east
    );

    // Clean and filter for plants
    const cleanedPlants = dataCleaner.cleanInfrastructureData(hydrogenData, 'plants')
      .filter(element => 
        element.tags?.power === 'plant' || 
        element.tags?.['plant:source'] === 'hydrogen' ||
        element.tags?.amenity === 'fuel'
      );

    // Update data store
    dataStore.plants = cleanedPlants;
    dataStore.lastUpdated.plants = new Date().toISOString();

    res.json({
      success: true,
      data: {
        plants: cleanedPlants,
        count: cleanedPlants.length,
        boundingBox,
        refreshedAt: dataStore.lastUpdated.plants
      }
    });

    logger.info(`Refreshed plants data: ${cleanedPlants.length} plants`);

    // Emit update to connected clients
    if (global.io) {
      global.io.to('infrastructure-updates').emit('plants-refreshed', {
        count: cleanedPlants.length,
        timestamp: dataStore.lastUpdated.plants
      });
    }

  } catch (error) {
    logger.error(`Error refreshing plants data: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh plants data'
    });
  }
};

/**
 * Add a new plant (for future use with user submissions)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const addPlant = async (req, res) => {
  try {
    const { name, latitude, longitude, capacity, type, status } = req.body;

    // Validation
    if (!name || typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Name, latitude, and longitude are required'
      });
    }

    // Create new plant object
    const newPlant = {
      id: `user_plant_${Date.now()}`,
      type: 'node',
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      properties: {
        name,
        capacity: capacity || 0,
        status: status || 'planned',
        operationalType: type || 'production'
      },
      tags: {
        name,
        'plant:source': 'hydrogen',
        capacity: capacity?.toString(),
        status
      },
      lastUpdated: new Date().toISOString(),
      source: 'user_submission'
    };

    // Add to data store
    dataStore.plants.push(newPlant);
    dataStore.lastUpdated.plants = new Date().toISOString();

    res.status(201).json({
      success: true,
      data: newPlant
    });

    logger.info(`Added new plant: ${name} at ${latitude}, ${longitude}`);

    // Emit update to connected clients
    if (global.io) {
      global.io.to('infrastructure-updates').emit('plant-added', newPlant);
    }

  } catch (error) {
    logger.error(`Error adding plant: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to add plant'
    });
  }
};
