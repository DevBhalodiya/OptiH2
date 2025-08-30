import express from 'express';
import {
  getAllRenewables,
  getSolarData,
  getWindData,
  getRenewablesStats,
  getBestRenewableLocations,
  refreshRenewablesData
} from '../controllers/renewablesController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RenewableData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the renewable data point
 *         name:
 *           type: string
 *           description: Location name
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *         solar:
 *           type: object
 *           properties:
 *             averageIrradiance:
 *               type: number
 *               description: Solar irradiance in kWh/m²/day
 *             suitabilityScore:
 *               type: number
 *               minimum: 0
 *               maximum: 100
 *         wind:
 *           type: object
 *           properties:
 *             speed:
 *               type: number
 *               description: Wind speed in m/s
 *             suitabilityScore:
 *               type: number
 *               minimum: 0
 *               maximum: 100
 *         lastUpdated:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/renewables:
 *   get:
 *     summary: Get all renewable energy data
 *     description: Retrieve renewable energy resource data for all monitored locations
 *     tags: [Renewables]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [solar, wind]
 *         description: Filter by renewable energy type
 *       - in: query
 *         name: minScore
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         description: Minimum suitability score
 *       - in: query
 *         name: maxScore
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         description: Maximum suitability score
 *     responses:
 *       200:
 *         description: List of renewable energy data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     renewables:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RenewableData'
 *                     count:
 *                       type: integer
 *                     lastUpdated:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllRenewables);

/**
 * @swagger
 * /api/renewables/solar:
 *   get:
 *     summary: Get solar irradiance data for specific location
 *     description: Retrieve solar energy resource data from NASA POWER API for a specific location
 *     tags: [Renewables]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude coordinate
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude coordinate
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           pattern: '^\\d{8}$'
 *         description: Start date in YYYYMMDD format
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           pattern: '^\\d{8}$'
 *         description: End date in YYYYMMDD format
 *     responses:
 *       200:
 *         description: Solar irradiance data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     location:
 *                       type: object
 *                       properties:
 *                         latitude:
 *                           type: number
 *                         longitude:
 *                           type: number
 *                     solar:
 *                       type: object
 *                       properties:
 *                         averageIrradiance:
 *                           type: number
 *                         suitabilityScore:
 *                           type: number
 *                     source:
 *                       type: string
 *                       enum: [cache, fresh]
 *       400:
 *         description: Invalid coordinates
 *       500:
 *         description: Failed to retrieve solar data
 */
router.get('/solar', getSolarData);

/**
 * @swagger
 * /api/renewables/wind:
 *   get:
 *     summary: Get wind data for specific location
 *     description: Retrieve wind energy resource data from OpenWeatherMap API for a specific location
 *     tags: [Renewables]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude coordinate
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude coordinate
 *       - in: query
 *         name: forecast
 *         schema:
 *           type: boolean
 *         description: Get wind forecast data instead of current
 *     responses:
 *       200:
 *         description: Wind resource data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     location:
 *                       type: object
 *                       properties:
 *                         latitude:
 *                           type: number
 *                         longitude:
 *                           type: number
 *                     wind:
 *                       type: object
 *                       properties:
 *                         speed:
 *                           type: number
 *                         suitabilityScore:
 *                           type: number
 *                     source:
 *                       type: string
 *                       enum: [cache, fresh, fresh_forecast]
 *       400:
 *         description: Invalid coordinates
 *       500:
 *         description: Failed to retrieve wind data
 */
router.get('/wind', getWindData);

/**
 * @swagger
 * /api/renewables/stats:
 *   get:
 *     summary: Get renewable energy statistics
 *     description: Retrieve statistical analysis of renewable energy resources
 *     tags: [Renewables]
 *     responses:
 *       200:
 *         description: Renewable energy statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         solar:
 *                           type: object
 *                           properties:
 *                             averageIrradiance:
 *                               type: number
 *                             averageSuitability:
 *                               type: number
 *                             excellent:
 *                               type: integer
 *                             good:
 *                               type: integer
 *                             fair:
 *                               type: integer
 *                             poor:
 *                               type: integer
 *                         wind:
 *                           type: object
 *                           properties:
 *                             averageSpeed:
 *                               type: number
 *                             averageSuitability:
 *                               type: number
 *                             excellent:
 *                               type: integer
 *                             good:
 *                               type: integer
 *                             fair:
 *                               type: integer
 *                             poor:
 *                               type: integer
 *       500:
 *         description: Internal server error
 */
router.get('/stats', getRenewablesStats);

/**
 * @swagger
 * /api/renewables/best:
 *   get:
 *     summary: Get best renewable energy locations
 *     description: Retrieve top-ranked locations for renewable energy development
 *     tags: [Renewables]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [solar, wind, combined]
 *           default: combined
 *         description: Type of renewable energy to rank by
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Maximum number of results to return
 *     responses:
 *       200:
 *         description: Best renewable energy locations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     bestLocations:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/RenewableData'
 *                           - type: object
 *                             properties:
 *                               rank:
 *                                 type: integer
 *                               overallScore:
 *                                 type: number
 *       500:
 *         description: Internal server error
 */
router.get('/best', getBestRenewableLocations);

/**
 * @swagger
 * /api/renewables/refresh:
 *   post:
 *     summary: Refresh renewable energy data
 *     description: Trigger a manual refresh of renewable energy data from external APIs
 *     tags: [Renewables]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               locations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     lat:
 *                       type: number
 *                     lon:
 *                       type: number
 *                 description: Custom locations to refresh (optional)
 *     responses:
 *       200:
 *         description: Renewable data refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     renewables:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RenewableData'
 *                     count:
 *                       type: integer
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           location:
 *                             type: string
 *                           error:
 *                             type: string
 *       500:
 *         description: Failed to refresh renewable data
 */
router.post('/refresh', refreshRenewablesData);

export default router;
