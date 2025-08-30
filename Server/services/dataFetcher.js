import axios from 'axios';
import { logger } from './logger.js';

/**
 * Data fetcher service for external APIs
 * Handles all external API calls with error handling and rate limiting
 */
export class DataFetcher {
  constructor() {
    this.nasaPowerBaseUrl = process.env.NASA_POWER_BASE_URL || 'https://power.larc.nasa.gov/api/temporal/daily/point';
    this.worldBankBaseUrl = process.env.WORLD_BANK_BASE_URL || 'https://api.worldbank.org/v2';
    this.openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
    this.openWeatherBaseUrl = process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';
    this.overpassApiUrl = process.env.OVERPASS_API_URL || 'https://overpass-api.de/api/interpreter';
    
    // Configure axios defaults
    this.axiosConfig = {
      timeout: 10000,
      headers: {
        'User-Agent': 'OptiH2-Backend/1.0.0'
      }
    };
  }

  /**
   * Fetch solar irradiance data from NASA POWER API
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @param {string} startDate - Start date (YYYYMMDD format)
   * @param {string} endDate - End date (YYYYMMDD format)
   * @returns {Promise<Object>} Solar irradiance data
   */
  async fetchSolarData(latitude, longitude, startDate = null, endDate = null) {
    try {
      // Default to last 30 days if no dates provided
      if (!startDate || !endDate) {
        const end = new Date();
        const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        endDate = end.toISOString().slice(0, 10).replace(/-/g, '');
        startDate = start.toISOString().slice(0, 10).replace(/-/g, '');
      }

      const params = {
        parameters: 'ALLSKY_SFC_SW_DWN,CLRSKY_SFC_SW_DWN,T2M', // Solar irradiance and temperature
        community: 'RE',
        longitude,
        latitude,
        start: startDate,
        end: endDate,
        format: 'JSON'
      };

      const response = await axios.get(this.nasaPowerBaseUrl, {
        params,
        ...this.axiosConfig
      });

      logger.info(`Successfully fetched solar data for coordinates: ${latitude}, ${longitude}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch solar data: ${error.message}`);
      throw new Error(`NASA POWER API error: ${error.message}`);
    }
  }

  /**
   * Fetch wind data from OpenWeatherMap API
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @returns {Promise<Object>} Wind data
   */
  async fetchWindData(latitude, longitude) {
    try {
      if (!this.openWeatherApiKey) {
        throw new Error('OpenWeatherMap API key not configured');
      }

      const params = {
        lat: latitude,
        lon: longitude,
        appid: this.openWeatherApiKey,
        units: 'metric'
      };

      const response = await axios.get(`${this.openWeatherBaseUrl}/weather`, {
        params,
        ...this.axiosConfig
      });

      logger.info(`Successfully fetched wind data for coordinates: ${latitude}, ${longitude}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch wind data: ${error.message}`);
      throw new Error(`OpenWeatherMap API error: ${error.message}`);
    }
  }

  /**
   * Fetch wind forecast data from OpenWeatherMap API
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @returns {Promise<Object>} Wind forecast data
   */
  async fetchWindForecast(latitude, longitude) {
    try {
      if (!this.openWeatherApiKey) {
        throw new Error('OpenWeatherMap API key not configured');
      }

      const params = {
        lat: latitude,
        lon: longitude,
        appid: this.openWeatherApiKey,
        units: 'metric'
      };

      const response = await axios.get(`${this.openWeatherBaseUrl}/forecast`, {
        params,
        ...this.axiosConfig
      });

      logger.info(`Successfully fetched wind forecast for coordinates: ${latitude}, ${longitude}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch wind forecast: ${error.message}`);
      throw new Error(`OpenWeatherMap Forecast API error: ${error.message}`);
    }
  }

  /**
   * Fetch population data from World Bank API
   * @param {string} countryCode - ISO country code (e.g., 'US', 'DE')
   * @returns {Promise<Object>} Population data
   */
  async fetchPopulationData(countryCode) {
    try {
      const url = `${this.worldBankBaseUrl}/country/${countryCode}/indicator/SP.POP.TOTL?format=json&most_recent_values=1`;
      
      const response = await axios.get(url, this.axiosConfig);

      logger.info(`Successfully fetched population data for country: ${countryCode}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch population data: ${error.message}`);
      throw new Error(`World Bank API error: ${error.message}`);
    }
  }

  /**
   * Fetch urban population data from World Bank API
   * @param {string} countryCode - ISO country code
   * @returns {Promise<Object>} Urban population data
   */
  async fetchUrbanPopulationData(countryCode) {
    try {
      const url = `${this.worldBankBaseUrl}/country/${countryCode}/indicator/SP.URB.TOTL?format=json&most_recent_values=1`;
      
      const response = await axios.get(url, this.axiosConfig);

      logger.info(`Successfully fetched urban population data for country: ${countryCode}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch urban population data: ${error.message}`);
      throw new Error(`World Bank Urban Population API error: ${error.message}`);
    }
  }

  /**
   * Fetch hydrogen infrastructure data from OpenStreetMap via Overpass API
   * @param {number} south - South boundary
   * @param {number} west - West boundary
   * @param {number} north - North boundary
   * @param {number} east - East boundary
   * @returns {Promise<Object>} Infrastructure data
   */
  async fetchHydrogenInfrastructure(south, west, north, east) {
    try {
      // Overpass QL query for hydrogen-related infrastructure
      const query = `
        [out:json][timeout:25];
        (
          way["substance"="hydrogen"](${south},${west},${north},${east});
          way["pipeline"="gas"]["substance"="hydrogen"](${south},${west},${north},${east});
          node["amenity"="fuel"]["fuel:hydrogen"="yes"](${south},${west},${north},${east});
          way["power"="plant"]["plant:source"="hydrogen"](${south},${west},${north},${east});
          node["power"="plant"]["plant:source"="hydrogen"](${south},${west},${north},${east});
        );
        out geom;
      `;

      const response = await axios.post(this.overpassApiUrl, query, {
        headers: {
          'Content-Type': 'text/plain',
          ...this.axiosConfig.headers
        },
        timeout: 30000
      });

      logger.info(`Successfully fetched hydrogen infrastructure data for bbox: ${south},${west},${north},${east}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch hydrogen infrastructure: ${error.message}`);
      throw new Error(`Overpass API error: ${error.message}`);
    }
  }

  /**
   * Fetch pipeline data from OpenStreetMap via Overpass API
   * @param {number} south - South boundary
   * @param {number} west - West boundary
   * @param {number} north - North boundary
   * @param {number} east - East boundary
   * @returns {Promise<Object>} Pipeline data
   */
  async fetchPipelineData(south, west, north, east) {
    try {
      const query = `
        [out:json][timeout:25];
        (
          way["man_made"="pipeline"]["substance"~"gas|hydrogen"](${south},${west},${north},${east});
          way["pipeline"="gas"](${south},${west},${north},${east});
        );
        out geom;
      `;

      const response = await axios.post(this.overpassApiUrl, query, {
        headers: {
          'Content-Type': 'text/plain',
          ...this.axiosConfig.headers
        },
        timeout: 30000
      });

      logger.info(`Successfully fetched pipeline data for bbox: ${south},${west},${north},${east}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch pipeline data: ${error.message}`);
      throw new Error(`Overpass Pipeline API error: ${error.message}`);
    }
  }

  /**
   * Fetch industrial areas that could be demand centers
   * @param {number} south - South boundary
   * @param {number} west - West boundary
   * @param {number} north - North boundary
   * @param {number} east - East boundary
   * @returns {Promise<Object>} Industrial area data
   */
  async fetchIndustrialAreas(south, west, north, east) {
    try {
      const query = `
        [out:json][timeout:25];
        (
          way["landuse"="industrial"](${south},${west},${north},${east});
          way["landuse"="commercial"](${south},${west},${north},${east});
          node["amenity"="fuel"](${south},${west},${north},${east});
          way["railway"="station"](${south},${west},${north},${east});
          node["railway"="station"](${south},${west},${north},${east});
        );
        out geom;
      `;

      const response = await axios.post(this.overpassApiUrl, query, {
        headers: {
          'Content-Type': 'text/plain',
          ...this.axiosConfig.headers
        },
        timeout: 30000
      });

      logger.info(`Successfully fetched industrial areas for bbox: ${south},${west},${north},${east}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch industrial areas: ${error.message}`);
      throw new Error(`Overpass Industrial API error: ${error.message}`);
    }
  }
}

// Export singleton instance
export const dataFetcher = new DataFetcher();
