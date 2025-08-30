import cron from 'node-cron';
import { dataFetcher } from '../services/dataFetcher.js';
import { dataCleaner } from '../services/dataCleaner.js';
import { logger } from '../services/logger.js';

/**
 * Cron job for scheduled data fetching and updates
 * Runs every hour to keep data fresh and current
 */

// In-memory data store
export const dataStore = {
  plants: [],
  pipelines: [],
  renewables: [],
  demand: [],
  lastUpdated: {
    plants: null,
    pipelines: null,
    renewables: null,
    demand: null
  }
};

// Sample Indian hydrogen infrastructure data
const sampleIndianData = {
  plants: [
    {
      id: 'plant-1',
      name: 'Gujarat Green Hydrogen Plant',
      geometry: {
        type: 'Point',
        coordinates: [72.5714, 23.0225] // Gujarat
      },
      properties: {
        capacity: 500,
        status: 'operational',
        operationalType: 'production',
        state: 'Gujarat',
        country: 'India'
      },
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'plant-2',
      name: 'Maharashtra Hydrogen Hub',
      geometry: {
        type: 'Point',
        coordinates: [75.7139, 19.7515] // Maharashtra
      },
      properties: {
        capacity: 750,
        status: 'operational',
        operationalType: 'production',
        state: 'Maharashtra',
        country: 'India'
      },
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'plant-3',
      name: 'Rajasthan Solar-H2 Facility',
      geometry: {
        type: 'Point',
        coordinates: [74.2179, 27.0238] // Rajasthan
      },
      properties: {
        capacity: 300,
        status: 'under_construction',
        operationalType: 'hydrogen',
        state: 'Rajasthan',
        country: 'India'
      },
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'plant-4',
      name: 'Tamil Nadu Storage Center',
      geometry: {
        type: 'Point',
        coordinates: [78.6569, 11.0168] // Tamil Nadu
      },
      properties: {
        capacity: 200,
        status: 'planned',
        operationalType: 'storage',
        state: 'Tamil Nadu',
        country: 'India'
      },
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'plant-5',
      name: 'Karnataka Distribution Hub',
      geometry: {
        type: 'Point',
        coordinates: [75.7139, 15.3173] // Karnataka
      },
      properties: {
        capacity: 150,
        status: 'operational',
        operationalType: 'distribution',
        state: 'Karnataka',
        country: 'India'
      },
      lastUpdated: new Date().toISOString()
    }
  ],
  pipelines: [
    {
      id: 'pipeline-1',
      name: 'Gujarat-Maharashtra Pipeline',
      geometry: {
        type: 'LineString',
        coordinates: [
          [72.5714, 23.0225],
          [75.7139, 19.7515]
        ]
      },
      properties: {
        length: 450,
        capacity: 1000,
        status: 'operational',
        material: 'steel',
        diameter: 30
      },
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'pipeline-2',
      name: 'Rajasthan Supply Line',
      geometry: {
        type: 'LineString',
        coordinates: [
          [74.2179, 27.0238],
          [77.1025, 28.7041]
        ]
      },
      properties: {
        length: 320,
        capacity: 800,
        status: 'under_construction',
        material: 'composite',
        diameter: 25
      },
      lastUpdated: new Date().toISOString()
    }
  ],
  renewables: [
    {
      id: 'renewable-1',
      location: {
        latitude: 27.0238,
        longitude: 74.2179,
        state: 'Rajasthan',
        country: 'India'
      },
      solar: {
        suitabilityScore: 85,
        averageIrradiance: 6.2,
        peakSunHours: 7.5
      },
      wind: {
        suitabilityScore: 65,
        averageWindSpeed: 4.8,
        windPowerDensity: 250
      },
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'renewable-2',
      location: {
        latitude: 23.0225,
        longitude: 72.5714,
        state: 'Gujarat',
        country: 'India'
      },
      solar: {
        suitabilityScore: 80,
        averageIrradiance: 5.8,
        peakSunHours: 7.0
      },
      wind: {
        suitabilityScore: 75,
        averageWindSpeed: 5.2,
        windPowerDensity: 320
      },
      lastUpdated: new Date().toISOString()
    }
  ],
  demand: [
    {
      id: 'demand-1',
      name: 'Mumbai Industrial Zone',
      location: {
        latitude: 19.0760,
        longitude: 72.8777,
        state: 'Maharashtra',
        country: 'India'
      },
      population: {
        total: 12442373,
        urban: 11800000,
        rural: 642373
      },
      industrialDemand: 850,
      transportDemand: 420,
      urbanPopulation: {
        total: 11800000,
        density: 20694
      },
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'demand-2',
      name: 'Delhi NCR Region',
      location: {
        latitude: 28.7041,
        longitude: 77.1025,
        state: 'Delhi',
        country: 'India'
      },
      population: {
        total: 16753235,
        urban: 14000000,
        rural: 2753235
      },
      industrialDemand: 1200,
      transportDemand: 680,
      urbanPopulation: {
        total: 14000000,
        density: 11297
      },
      lastUpdated: new Date().toISOString()
    }
  ]
};

// Initialize with sample data
function initializeSampleData() {
  dataStore.plants = [...sampleIndianData.plants];
  dataStore.pipelines = [...sampleIndianData.pipelines];
  dataStore.renewables = [...sampleIndianData.renewables];
  dataStore.demand = [...sampleIndianData.demand];
  
  const now = new Date().toISOString();
  dataStore.lastUpdated.plants = now;
  dataStore.lastUpdated.pipelines = now;
  dataStore.lastUpdated.renewables = now;
  dataStore.lastUpdated.demand = now;
  
  logger.info(`Initialized with sample data: ${dataStore.plants.length} plants, ${dataStore.pipelines.length} pipelines, ${dataStore.renewables.length} renewables, ${dataStore.demand.length} demand centers`);
}

// Initialize sample data on startup
initializeSampleData();

/**
 * Fetch and update all hydrogen infrastructure data
 */
async function updateInfrastructureData() {
  try {
    logger.info('Starting infrastructure data update...');
    
    // Default bounding box (can be made configurable)
    const boundingBox = {
      south: 35.0,
      west: -125.0,
      north: 55.0,
      east: -65.0
    };

    // Fetch hydrogen infrastructure
    const hydrogenData = await dataFetcher.fetchHydrogenInfrastructure(
      boundingBox.south,
      boundingBox.west,
      boundingBox.north,
      boundingBox.east
    );

    // Clean and categorize infrastructure data
    const cleanedPlants = dataCleaner.cleanInfrastructureData(hydrogenData, 'plants')
      .filter(element => 
        element.tags?.power === 'plant' || 
        element.tags?.['plant:source'] === 'hydrogen' ||
        element.tags?.amenity === 'fuel'
      );

    // Fetch pipeline data separately
    const pipelineData = await dataFetcher.fetchPipelineData(
      boundingBox.south,
      boundingBox.west,
      boundingBox.north,
      boundingBox.east
    );

    const cleanedPipelines = dataCleaner.cleanInfrastructureData(pipelineData, 'pipelines');

    // Update data store
    dataStore.plants = cleanedPlants;
    dataStore.pipelines = cleanedPipelines;
    dataStore.lastUpdated.plants = new Date().toISOString();
    dataStore.lastUpdated.pipelines = new Date().toISOString();

    logger.info(`Updated infrastructure data: ${cleanedPlants.length} plants, ${cleanedPipelines.length} pipelines`);

    // Emit update to connected clients
    if (global.io) {
      global.io.to('infrastructure-updates').emit('data-update', {
        type: 'infrastructure',
        plants: cleanedPlants.length,
        pipelines: cleanedPipelines.length,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    logger.error(`Failed to update infrastructure data: ${error.message}`);
  }
}

/**
 * Fetch and update renewable energy data for major cities
 */
async function updateRenewableData() {
  try {
    logger.info('Starting renewable energy data update...');
    
    // Major cities for renewable data sampling
    const majorCities = [
      { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
      { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
      { name: 'Houston', lat: 29.7604, lon: -95.3698 },
      { name: 'Phoenix', lat: 33.4484, lon: -112.0740 },
      { name: 'Denver', lat: 39.7392, lon: -104.9903 },
      { name: 'Seattle', lat: 47.6062, lon: -122.3321 },
      { name: 'Miami', lat: 25.7617, lon: -80.1918 },
      { name: 'Boston', lat: 42.3601, lon: -71.0589 }
    ];

    const renewableDataPoints = [];

    for (const city of majorCities) {
      try {
        // Fetch solar data
        const solarData = await dataFetcher.fetchSolarData(city.lat, city.lon);
        const cleanedSolar = dataCleaner.cleanSolarData(solarData, city.lat, city.lon);

        // Fetch wind data
        const windData = await dataFetcher.fetchWindData(city.lat, city.lon);
        const cleanedWind = dataCleaner.cleanWindData(windData);

        // Combine renewable data
        renewableDataPoints.push({
          id: `renewable_${city.name.toLowerCase().replace(/\s+/g, '_')}`,
          name: city.name,
          location: {
            latitude: city.lat,
            longitude: city.lon
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
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (cityError) {
        logger.warn(`Failed to fetch renewable data for ${city.name}: ${cityError.message}`);
      }
    }

    // Update data store
    dataStore.renewables = renewableDataPoints;
    dataStore.lastUpdated.renewables = new Date().toISOString();

    logger.info(`Updated renewable data: ${renewableDataPoints.length} data points`);

    // Emit update to connected clients
    if (global.io) {
      global.io.to('renewable-updates').emit('data-update', {
        type: 'renewables',
        count: renewableDataPoints.length,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    logger.error(`Failed to update renewable data: ${error.message}`);
  }
}

/**
 * Fetch and update demand center data
 */
async function updateDemandData() {
  try {
    logger.info('Starting demand center data update...');
    
    // Major countries for demand data
    const countries = ['US', 'CA', 'MX', 'DE', 'FR', 'GB', 'JP', 'CN', 'IN', 'BR'];
    const demandDataPoints = [];

    for (const countryCode of countries) {
      try {
        // Fetch population data
        const populationData = await dataFetcher.fetchPopulationData(countryCode);
        const cleanedPopulation = dataCleaner.cleanPopulationData(populationData, countryCode);

        // Fetch urban population for additional context
        const urbanData = await dataFetcher.fetchUrbanPopulationData(countryCode);
        const cleanedUrban = dataCleaner.cleanPopulationData(urbanData, countryCode);

        // Fetch industrial areas (using country capital coordinates as proxy)
        const countryCoords = getCountryCoordinates(countryCode);
        if (countryCoords) {
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

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (countryError) {
        logger.warn(`Failed to fetch demand data for ${countryCode}: ${countryError.message}`);
      }
    }

    // Update data store
    dataStore.demand = demandDataPoints;
    dataStore.lastUpdated.demand = new Date().toISOString();

    logger.info(`Updated demand data: ${demandDataPoints.length} demand centers`);

    // Emit update to connected clients
    if (global.io) {
      global.io.to('demand-updates').emit('data-update', {
        type: 'demand',
        count: demandDataPoints.length,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    logger.error(`Failed to update demand data: ${error.message}`);
  }
}

/**
 * Get approximate coordinates for country codes (simplified)
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

/**
 * Run all data updates
 */
async function runFullDataUpdate() {
  const startTime = Date.now();
  logger.info('🔄 Starting scheduled data update job...');

  try {
    // Run updates in parallel where possible
    await Promise.allSettled([
      updateInfrastructureData(),
      updateRenewableData(),
      updateDemandData()
    ]);

    const duration = Date.now() - startTime;
    logger.info(`✅ Scheduled data update completed in ${duration}ms`);

    // Emit global update notification
    if (global.io) {
      global.io.emit('global-update', {
        type: 'full-update',
        duration,
        timestamp: new Date().toISOString(),
        dataStatus: {
          plants: dataStore.plants.length,
          pipelines: dataStore.pipelines.length,
          renewables: dataStore.renewables.length,
          demand: dataStore.demand.length
        }
      });
    }

  } catch (error) {
    logger.error(`❌ Scheduled data update failed: ${error.message}`);
  }
}

// Schedule cron job to run every hour
const cronExpression = process.env.DATA_FETCH_INTERVAL || '0 */1 * * *';

cron.schedule(cronExpression, runFullDataUpdate, {
  scheduled: true,
  timezone: "UTC"
});

// Run initial data fetch on startup (with delay to ensure server is ready)
setTimeout(() => {
  logger.info('🚀 Running initial data fetch...');
  runFullDataUpdate();
}, 5000); // 5-second delay

// Export for manual triggering
export { runFullDataUpdate };

logger.info(`📅 Cron job scheduled with expression: ${cronExpression}`);
