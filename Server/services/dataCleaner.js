import { logger } from './logger.js';

/**
 * Data cleaning and normalization service
 * Standardizes data from various external APIs into consistent formats
 */
export class DataCleaner {
  constructor() {}

  /**
   * Clean and normalize NASA POWER solar data
   * @param {Object} rawData - Raw NASA POWER API response
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @returns {Object} Normalized solar data
   */
  cleanSolarData(rawData, latitude, longitude) {
    try {
      if (!rawData.properties || !rawData.properties.parameter) {
        throw new Error('Invalid NASA POWER data structure');
      }

      const parameters = rawData.properties.parameter;
      const dates = Object.keys(parameters.ALLSKY_SFC_SW_DWN || {});
      
      // Calculate averages
      const solarIrradiance = this.calculateAverage(Object.values(parameters.ALLSKY_SFC_SW_DWN || {}));
      const clearSkyIrradiance = this.calculateAverage(Object.values(parameters.CLRSKY_SFC_SW_DWN || {}));
      const temperature = this.calculateAverage(Object.values(parameters.T2M || {}));

      const cleanedData = {
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        },
        solar: {
          averageIrradiance: solarIrradiance, // kWh/m²/day
          clearSkyIrradiance: clearSkyIrradiance, // kWh/m²/day
          cloudCover: clearSkyIrradiance > 0 ? (1 - (solarIrradiance / clearSkyIrradiance)) * 100 : 0,
          suitabilityScore: this.calculateSolarSuitability(solarIrradiance)
        },
        weather: {
          averageTemperature: temperature // °C
        },
        dataRange: {
          startDate: dates[0],
          endDate: dates[dates.length - 1],
          sampleSize: dates.length
        },
        lastUpdated: new Date().toISOString()
      };

      logger.info(`Successfully cleaned solar data for coordinates: ${latitude}, ${longitude}`);
      return cleanedData;
    } catch (error) {
      logger.error(`Failed to clean solar data: ${error.message}`);
      throw new Error(`Data cleaning error: ${error.message}`);
    }
  }

  /**
   * Clean and normalize OpenWeatherMap wind data
   * @param {Object} rawData - Raw OpenWeatherMap API response
   * @returns {Object} Normalized wind data
   */
  cleanWindData(rawData) {
    try {
      if (!rawData.wind) {
        throw new Error('Invalid OpenWeatherMap data structure');
      }

      const cleanedData = {
        location: {
          latitude: rawData.coord?.lat || 0,
          longitude: rawData.coord?.lon || 0,
          name: rawData.name || 'Unknown'
        },
        wind: {
          speed: rawData.wind.speed || 0, // m/s
          direction: rawData.wind.deg || 0, // degrees
          gust: rawData.wind.gust || rawData.wind.speed || 0, // m/s
          suitabilityScore: this.calculateWindSuitability(rawData.wind.speed || 0)
        },
        weather: {
          temperature: rawData.main?.temp || 0, // °C
          humidity: rawData.main?.humidity || 0, // %
          pressure: rawData.main?.pressure || 0, // hPa
          description: rawData.weather?.[0]?.description || 'Unknown'
        },
        lastUpdated: new Date().toISOString()
      };

      logger.info(`Successfully cleaned wind data for location: ${cleanedData.location.name}`);
      return cleanedData;
    } catch (error) {
      logger.error(`Failed to clean wind data: ${error.message}`);
      throw new Error(`Wind data cleaning error: ${error.message}`);
    }
  }

  /**
   * Clean and normalize wind forecast data
   * @param {Object} rawData - Raw OpenWeatherMap forecast response
   * @returns {Object} Normalized wind forecast data
   */
  cleanWindForecastData(rawData) {
    try {
      if (!rawData.list || !Array.isArray(rawData.list)) {
        throw new Error('Invalid OpenWeatherMap forecast data structure');
      }

      const forecasts = rawData.list.map(item => ({
        timestamp: new Date(item.dt * 1000).toISOString(),
        wind: {
          speed: item.wind?.speed || 0,
          direction: item.wind?.deg || 0,
          gust: item.wind?.gust || item.wind?.speed || 0
        },
        weather: {
          temperature: item.main?.temp || 0,
          humidity: item.main?.humidity || 0,
          pressure: item.main?.pressure || 0,
          description: item.weather?.[0]?.description || 'Unknown'
        }
      }));

      // Calculate forecast averages
      const avgWindSpeed = this.calculateAverage(forecasts.map(f => f.wind.speed));
      const avgTemperature = this.calculateAverage(forecasts.map(f => f.weather.temperature));

      const cleanedData = {
        location: {
          latitude: rawData.city?.coord?.lat || 0,
          longitude: rawData.city?.coord?.lon || 0,
          name: rawData.city?.name || 'Unknown'
        },
        forecast: {
          averageWindSpeed: avgWindSpeed,
          averageTemperature: avgTemperature,
          suitabilityScore: this.calculateWindSuitability(avgWindSpeed),
          forecasts: forecasts.slice(0, 40) // Limit to 5 days (8 forecasts per day)
        },
        lastUpdated: new Date().toISOString()
      };

      logger.info(`Successfully cleaned wind forecast data for location: ${cleanedData.location.name}`);
      return cleanedData;
    } catch (error) {
      logger.error(`Failed to clean wind forecast data: ${error.message}`);
      throw new Error(`Wind forecast cleaning error: ${error.message}`);
    }
  }

  /**
   * Clean and normalize World Bank population data
   * @param {Array} rawData - Raw World Bank API response
   * @param {string} countryCode - Country code
   * @returns {Object} Normalized population data
   */
  cleanPopulationData(rawData, countryCode) {
    try {
      if (!Array.isArray(rawData) || rawData.length < 2) {
        throw new Error('Invalid World Bank data structure');
      }

      const data = rawData[1]; // World Bank returns metadata in [0], data in [1]
      if (!data || data.length === 0) {
        throw new Error('No population data available');
      }

      const latestData = data[0]; // Most recent data first
      
      const cleanedData = {
        country: {
          code: latestData.countryiso3code || countryCode,
          name: latestData.country?.value || 'Unknown'
        },
        population: {
          total: latestData.value || 0,
          year: latestData.date || new Date().getFullYear(),
          demandScore: this.calculateDemandScore(latestData.value || 0)
        },
        indicator: {
          id: latestData.indicator?.id || 'SP.POP.TOTL',
          name: latestData.indicator?.value || 'Population, total'
        },
        lastUpdated: new Date().toISOString()
      };

      logger.info(`Successfully cleaned population data for country: ${countryCode}`);
      return cleanedData;
    } catch (error) {
      logger.error(`Failed to clean population data: ${error.message}`);
      throw new Error(`Population data cleaning error: ${error.message}`);
    }
  }

  /**
   * Clean and normalize Overpass API infrastructure data
   * @param {Object} rawData - Raw Overpass API response
   * @param {string} type - Type of infrastructure (plants, pipelines, demand)
   * @returns {Array} Normalized infrastructure data
   */
  cleanInfrastructureData(rawData, type = 'infrastructure') {
    try {
      if (!rawData.elements || !Array.isArray(rawData.elements)) {
        return []; // Return empty array if no data
      }

      const cleanedElements = rawData.elements.map((element, index) => {
        const baseData = {
          id: element.id?.toString() || `${type}_${index}`,
          type: element.type || 'unknown',
          tags: element.tags || {},
          lastUpdated: new Date().toISOString()
        };

        // Handle different element types
        if (element.type === 'node') {
          return {
            ...baseData,
            geometry: {
              type: 'Point',
              coordinates: [element.lon || 0, element.lat || 0]
            },
            properties: {
              name: element.tags?.name || `${type}_${element.id}`,
              capacity: this.extractCapacity(element.tags),
              status: this.extractStatus(element.tags),
              operationalType: this.extractOperationalType(element.tags, type)
            }
          };
        } else if (element.type === 'way') {
          const coordinates = element.geometry?.map(coord => [coord.lon, coord.lat]) || [];
          
          return {
            ...baseData,
            geometry: {
              type: coordinates.length > 2 ? 'LineString' : 'Point',
              coordinates: coordinates.length > 0 ? coordinates : [0, 0]
            },
            properties: {
              name: element.tags?.name || `${type}_${element.id}`,
              length: this.calculateLineLength(coordinates),
              capacity: this.extractCapacity(element.tags),
              status: this.extractStatus(element.tags),
              operationalType: this.extractOperationalType(element.tags, type)
            }
          };
        }

        return baseData;
      }).filter(element => element.geometry); // Filter out elements without geometry

      logger.info(`Successfully cleaned ${cleanedElements.length} ${type} infrastructure elements`);
      return cleanedElements;
    } catch (error) {
      logger.error(`Failed to clean infrastructure data: ${error.message}`);
      throw new Error(`Infrastructure data cleaning error: ${error.message}`);
    }
  }

  /**
   * Calculate average from array of numbers
   * @param {Array<number>} values - Array of numeric values
   * @returns {number} Average value
   */
  calculateAverage(values) {
    const numericValues = values.filter(v => typeof v === 'number' && !isNaN(v));
    if (numericValues.length === 0) return 0;
    return numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
  }

  /**
   * Calculate solar suitability score (0-100)
   * @param {number} irradiance - Solar irradiance in kWh/m²/day
   * @returns {number} Suitability score
   */
  calculateSolarSuitability(irradiance) {
    // Excellent: >6 kWh/m²/day, Good: 4-6, Fair: 2-4, Poor: <2
    if (irradiance >= 6) return 100;
    if (irradiance >= 4) return 80;
    if (irradiance >= 2) return 60;
    return Math.max(0, irradiance * 30); // Linear scale for low values
  }

  /**
   * Calculate wind suitability score (0-100)
   * @param {number} windSpeed - Wind speed in m/s
   * @returns {number} Suitability score
   */
  calculateWindSuitability(windSpeed) {
    // Excellent: >7 m/s, Good: 5-7, Fair: 3-5, Poor: <3
    if (windSpeed >= 7) return 100;
    if (windSpeed >= 5) return 80;
    if (windSpeed >= 3) return 60;
    return Math.max(0, windSpeed * 20); // Linear scale for low values
  }

  /**
   * Calculate demand score based on population
   * @param {number} population - Population count
   * @returns {number} Demand score (0-100)
   */
  calculateDemandScore(population) {
    // Logarithmic scale for population-based demand
    if (population <= 0) return 0;
    if (population >= 10000000) return 100; // 10M+ people
    if (population >= 1000000) return 90;   // 1M+ people
    if (population >= 100000) return 70;    // 100K+ people
    if (population >= 10000) return 50;     // 10K+ people
    return Math.min(50, Math.log10(population) * 10); // Logarithmic for smaller populations
  }

  /**
   * Extract capacity from OSM tags
   * @param {Object} tags - OSM element tags
   * @returns {number} Capacity value
   */
  extractCapacity(tags) {
    const capacityFields = ['capacity', 'generator:output', 'power', 'diameter'];
    for (const field of capacityFields) {
      if (tags[field]) {
        const capacity = parseFloat(tags[field].replace(/[^\d.]/g, ''));
        if (!isNaN(capacity)) return capacity;
      }
    }
    return 0;
  }

  /**
   * Extract status from OSM tags
   * @param {Object} tags - OSM element tags
   * @returns {string} Status value
   */
  extractStatus(tags) {
    if (tags.construction) return 'under_construction';
    if (tags.proposed) return 'planned';
    if (tags.disused === 'yes' || tags.abandoned === 'yes') return 'decommissioned';
    return 'operational';
  }

  /**
   * Extract operational type from OSM tags
   * @param {Object} tags - OSM element tags
   * @param {string} defaultType - Default type if not found
   * @returns {string} Operational type
   */
  extractOperationalType(tags, defaultType) {
    if (tags['plant:source']) return tags['plant:source'];
    if (tags.substance) return tags.substance;
    if (tags.pipeline) return 'pipeline';
    if (tags.amenity === 'fuel') return 'distribution';
    if (tags.power === 'plant') return 'production';
    if (tags.landuse === 'industrial') return 'industrial_demand';
    if (tags.landuse === 'commercial') return 'commercial_demand';
    return defaultType;
  }

  /**
   * Calculate approximate line length from coordinates
   * @param {Array<Array<number>>} coordinates - Array of [lon, lat] coordinates
   * @returns {number} Approximate length in kilometers
   */
  calculateLineLength(coordinates) {
    if (coordinates.length < 2) return 0;
    
    let totalLength = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const [lon1, lat1] = coordinates[i - 1];
      const [lon2, lat2] = coordinates[i];
      totalLength += this.haversineDistance(lat1, lon1, lat2, lon2);
    }
    return totalLength;
  }

  /**
   * Calculate distance between two points using Haversine formula
   * @param {number} lat1 - Latitude 1
   * @param {number} lon1 - Longitude 1
   * @param {number} lat2 - Latitude 2
   * @param {number} lon2 - Longitude 2
   * @returns {number} Distance in kilometers
   */
  haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

// Export singleton instance
export const dataCleaner = new DataCleaner();
