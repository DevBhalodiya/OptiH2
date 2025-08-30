import { dataStore } from '../jobs/cronFetch.js';
import { dataFetcher } from '../services/dataFetcher.js';
import { dataCleaner } from '../services/dataCleaner.js';
import { logger } from '../services/logger.js';

/**
 * Controller for hydrogen pipelines endpoints
 * Handles retrieval and management of hydrogen transportation infrastructure
 */

/**
 * Get all hydrogen pipelines
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllPipelines = async (req, res) => {
  try {
    const { lat, lon, radius, minLength, maxLength, status } = req.query;
    let pipelines = [...dataStore.pipelines];

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

      pipelines = pipelines.filter(pipeline => {
        if (pipeline.geometry?.type === 'LineString') {
          // Check if any point of the pipeline is within radius
          return pipeline.geometry.coordinates.some(coord => {
            const distance = dataCleaner.haversineDistance(latitude, longitude, coord[1], coord[0]);
            return distance <= searchRadius;
          });
        } else if (pipeline.geometry?.type === 'Point') {
          const distance = dataCleaner.haversineDistance(
            latitude, longitude, 
            pipeline.geometry.coordinates[1], 
            pipeline.geometry.coordinates[0]
          );
          return distance <= searchRadius;
        }
        return false;
      });
    }

    // Filter by length if provided
    if (minLength || maxLength) {
      const minLen = parseFloat(minLength) || 0;
      const maxLen = parseFloat(maxLength) || Infinity;
      
      pipelines = pipelines.filter(pipeline => {
        const length = pipeline.properties?.length || 0;
        return length >= minLen && length <= maxLen;
      });
    }

    // Filter by status if provided
    if (status) {
      pipelines = pipelines.filter(pipeline => 
        pipeline.properties?.status?.toLowerCase() === status.toLowerCase()
      );
    }

    res.json({
      success: true,
      data: {
        pipelines,
        count: pipelines.length,
        lastUpdated: dataStore.lastUpdated.pipelines,
        filters: { lat, lon, radius, minLength, maxLength, status }
      }
    });

    logger.info(`Retrieved ${pipelines.length} pipelines with filters: ${JSON.stringify(req.query)}`);
  } catch (error) {
    logger.error(`Error getting pipelines: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve pipelines data'
    });
  }
};

/**
 * Get a specific pipeline by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPipelineById = async (req, res) => {
  try {
    const { id } = req.params;
    const pipeline = dataStore.pipelines.find(p => p.id === id);

    if (!pipeline) {
      return res.status(404).json({
        success: false,
        error: `Pipeline with ID ${id} not found`
      });
    }

    res.json({
      success: true,
      data: pipeline
    });

    logger.info(`Retrieved pipeline: ${id}`);
  } catch (error) {
    logger.error(`Error getting pipeline by ID: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve pipeline data'
    });
  }
};

/**
 * Get pipelines statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPipelinesStats = async (req, res) => {
  try {
    const pipelines = dataStore.pipelines;
    
    // Calculate statistics
    const stats = {
      total: pipelines.length,
      byStatus: {},
      totalLength: 0,
      averageLength: 0,
      totalCapacity: 0,
      averageCapacity: 0,
      geographicDistribution: {
        northern: 0,
        southern: 0,
        eastern: 0,
        western: 0
      },
      lengthDistribution: {
        short: 0,      // < 50 km
        medium: 0,     // 50-200 km
        long: 0,       // 200-500 km
        veryLong: 0    // > 500 km
      }
    };

    pipelines.forEach(pipeline => {
      const status = pipeline.properties?.status || 'unknown';
      const length = pipeline.properties?.length || 0;
      const capacity = pipeline.properties?.capacity || 0;

      // Count by status
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

      // Sum length and capacity
      stats.totalLength += length;
      stats.totalCapacity += capacity;

      // Length distribution
      if (length < 50) stats.lengthDistribution.short++;
      else if (length < 200) stats.lengthDistribution.medium++;
      else if (length < 500) stats.lengthDistribution.long++;
      else stats.lengthDistribution.veryLong++;

      // Geographic distribution (simplified)
      if (pipeline.geometry?.type === 'LineString' && pipeline.geometry.coordinates.length > 0) {
        const midIndex = Math.floor(pipeline.geometry.coordinates.length / 2);
        const [lon, lat] = pipeline.geometry.coordinates[midIndex];
        
        if (lat > 40) stats.geographicDistribution.northern++;
        else stats.geographicDistribution.southern++;
        
        if (lon > -100) stats.geographicDistribution.eastern++;
        else stats.geographicDistribution.western++;
      }
    });

    stats.averageLength = pipelines.length > 0 ? stats.totalLength / pipelines.length : 0;
    stats.averageCapacity = pipelines.length > 0 ? stats.totalCapacity / pipelines.length : 0;

    res.json({
      success: true,
      data: {
        statistics: stats,
        lastUpdated: dataStore.lastUpdated.pipelines,
        generatedAt: new Date().toISOString()
      }
    });

    logger.info('Generated pipelines statistics');
  } catch (error) {
    logger.error(`Error generating pipelines stats: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to generate pipelines statistics'
    });
  }
};

/**
 * Get pipelines network analysis
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPipelinesNetwork = async (req, res) => {
  try {
    const pipelines = dataStore.pipelines;
    
    // Analyze pipeline network connectivity
    const networkAnalysis = {
      totalPipelines: pipelines.length,
      totalLength: 0,
      connectedComponents: 0,
      networkDensity: 0,
      majorHubs: [],
      coverage: {
        states: new Set(),
        regions: []
      }
    };

    // Calculate total length
    networkAnalysis.totalLength = pipelines.reduce((sum, pipeline) => {
      return sum + (pipeline.properties?.length || 0);
    }, 0);

    // Find pipeline intersections and hubs
    const intersections = new Map();
    
    pipelines.forEach(pipeline => {
      if (pipeline.geometry?.type === 'LineString') {
        const coords = pipeline.geometry.coordinates;
        
        // Check start and end points for potential hubs
        [coords[0], coords[coords.length - 1]].forEach(coord => {
          const key = `${coord[0].toFixed(3)},${coord[1].toFixed(3)}`;
          if (!intersections.has(key)) {
            intersections.set(key, { count: 0, pipelines: [] });
          }
          intersections.get(key).count++;
          intersections.get(key).pipelines.push(pipeline.id);
        });
      }
    });

    // Identify major hubs (intersections with 3+ pipelines)
    intersections.forEach((data, coords) => {
      if (data.count >= 3) {
        const [lon, lat] = coords.split(',').map(parseFloat);
        networkAnalysis.majorHubs.push({
          coordinates: [lon, lat],
          pipelineCount: data.count,
          connectedPipelines: data.pipelines
        });
      }
    });

    // Calculate network density (simplified)
    const totalPossibleConnections = (pipelines.length * (pipelines.length - 1)) / 2;
    networkAnalysis.networkDensity = totalPossibleConnections > 0 ? 
      (intersections.size / totalPossibleConnections) * 100 : 0;

    // Geographic coverage analysis
    pipelines.forEach(pipeline => {
      if (pipeline.geometry?.coordinates) {
        // Simple state/region determination based on coordinates
        const coords = pipeline.geometry.type === 'LineString' ? 
          pipeline.geometry.coordinates[0] : pipeline.geometry.coordinates;
        
        if (coords[1] > 49) networkAnalysis.coverage.states.add('Canada');
        else if (coords[1] > 40) networkAnalysis.coverage.states.add('Northern US');
        else if (coords[1] > 30) networkAnalysis.coverage.states.add('Central US');
        else networkAnalysis.coverage.states.add('Southern US');
      }
    });

    networkAnalysis.coverage.regions = Array.from(networkAnalysis.coverage.states);
    delete networkAnalysis.coverage.states;

    res.json({
      success: true,
      data: {
        networkAnalysis,
        lastUpdated: dataStore.lastUpdated.pipelines,
        generatedAt: new Date().toISOString()
      }
    });

    logger.info('Generated pipeline network analysis');
  } catch (error) {
    logger.error(`Error generating pipeline network analysis: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to generate pipeline network analysis'
    });
  }
};

/**
 * Refresh pipelines data from external sources
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const refreshPipelinesData = async (req, res) => {
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

    // Fetch fresh pipeline data
    const pipelineData = await dataFetcher.fetchPipelineData(
      boundingBox.south,
      boundingBox.west,
      boundingBox.north,
      boundingBox.east
    );

    // Clean pipeline data
    const cleanedPipelines = dataCleaner.cleanInfrastructureData(pipelineData, 'pipelines');

    // Update data store
    dataStore.pipelines = cleanedPipelines;
    dataStore.lastUpdated.pipelines = new Date().toISOString();

    res.json({
      success: true,
      data: {
        pipelines: cleanedPipelines,
        count: cleanedPipelines.length,
        boundingBox,
        refreshedAt: dataStore.lastUpdated.pipelines
      }
    });

    logger.info(`Refreshed pipelines data: ${cleanedPipelines.length} pipelines`);

    // Emit update to connected clients
    if (global.io) {
      global.io.to('infrastructure-updates').emit('pipelines-refreshed', {
        count: cleanedPipelines.length,
        timestamp: dataStore.lastUpdated.pipelines
      });
    }

  } catch (error) {
    logger.error(`Error refreshing pipelines data: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh pipelines data'
    });
  }
};

/**
 * Find pipelines within a specific route
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getPipelinesInRoute = async (req, res) => {
  try {
    const { startLat, startLon, endLat, endLon, corridor } = req.query;
    
    if (!startLat || !startLon || !endLat || !endLon) {
      return res.status(400).json({
        success: false,
        error: 'Start and end coordinates are required'
      });
    }

    const start = { lat: parseFloat(startLat), lon: parseFloat(startLon) };
    const end = { lat: parseFloat(endLat), lon: parseFloat(endLon) };
    const corridorWidth = parseFloat(corridor) || 50; // Default 50km corridor

    if (isNaN(start.lat) || isNaN(start.lon) || isNaN(end.lat) || isNaN(end.lon)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinates provided'
      });
    }

    // Find pipelines within the corridor
    const pipelinesInRoute = dataStore.pipelines.filter(pipeline => {
      if (pipeline.geometry?.type === 'LineString') {
        // Check if any segment of the pipeline intersects with the route corridor
        return pipeline.geometry.coordinates.some(coord => {
          const distanceToRoute = distanceToLineSegment(
            { lat: coord[1], lon: coord[0] },
            start,
            end
          );
          return distanceToRoute <= corridorWidth;
        });
      }
      return false;
    });

    res.json({
      success: true,
      data: {
        pipelines: pipelinesInRoute,
        count: pipelinesInRoute.length,
        route: { start, end, corridorWidth },
        lastUpdated: dataStore.lastUpdated.pipelines
      }
    });

    logger.info(`Found ${pipelinesInRoute.length} pipelines in route corridor`);
  } catch (error) {
    logger.error(`Error finding pipelines in route: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to find pipelines in route'
    });
  }
};

/**
 * Calculate distance from a point to a line segment
 * @param {Object} point - Point coordinates
 * @param {Object} lineStart - Line start coordinates
 * @param {Object} lineEnd - Line end coordinates
 * @returns {number} Distance in kilometers
 */
function distanceToLineSegment(point, lineStart, lineEnd) {
  const A = point.lat - lineStart.lat;
  const B = point.lon - lineStart.lon;
  const C = lineEnd.lat - lineStart.lat;
  const D = lineEnd.lon - lineStart.lon;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  if (lenSq === 0) {
    // Line start and end are the same point
    return dataCleaner.haversineDistance(point.lat, point.lon, lineStart.lat, lineStart.lon);
  }

  const param = dot / lenSq;
  let closestPoint;

  if (param < 0) {
    closestPoint = lineStart;
  } else if (param > 1) {
    closestPoint = lineEnd;
  } else {
    closestPoint = {
      lat: lineStart.lat + param * C,
      lon: lineStart.lon + param * D
    };
  }

  return dataCleaner.haversineDistance(point.lat, point.lon, closestPoint.lat, closestPoint.lon);
}
