import express from 'express';
import {
  getAllDemandCenters,
  getDemandCenterById,
  getDemandStats,
  getTopDemandCenters,
  getDemandCentersNearby,
  refreshDemandData,
  getDemandForecast
} from '../controllers/demandController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DemandCenter:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the demand center
 *         name:
 *           type: string
 *           description: Name of the demand center (city/region)
 *         country:
 *           type: string
 *           description: ISO country code
 *         location:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *         population:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               description: Total population
 *             year:
 *               type: integer
 *               description: Data year
 *             demandScore:
 *               type: number
 *               minimum: 0
 *               maximum: 100
 *         urbanPopulation:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               description: Urban population
 *         industrialDemand:
 *           type: number
 *           description: Industrial hydrogen demand estimate
 *         transportDemand:
 *           type: number
 *           description: Transportation hydrogen demand estimate
 *         lastUpdated:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/demand:
 *   get:
 *     summary: Get all demand centers
 *     description: Retrieve hydrogen demand centers with population and industrial data
 *     tags: [Demand]
 *     parameters:
 *       - in: query
 *         name: minPopulation
 *         schema:
 *           type: integer
 *         description: Minimum population threshold
 *       - in: query
 *         name: maxPopulation
 *         schema:
 *           type: integer
 *         description: Maximum population threshold
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by ISO country code
 *       - in: query
 *         name: demandType
 *         schema:
 *           type: string
 *           enum: [industrial, transport, urban]
 *         description: Filter by demand type
 *     responses:
 *       200:
 *         description: List of demand centers
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
 *                     demandCenters:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/DemandCenter'
 *                     count:
 *                       type: integer
 *                     lastUpdated:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllDemandCenters);

/**
 * @swagger
 * /api/demand/stats:
 *   get:
 *     summary: Get demand centers statistics
 *     description: Retrieve statistical analysis of hydrogen demand centers
 *     tags: [Demand]
 *     responses:
 *       200:
 *         description: Demand centers statistics
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
 *                         totalPopulation:
 *                           type: integer
 *                         totalIndustrialDemand:
 *                           type: number
 *                         totalTransportDemand:
 *                           type: number
 *                         byCountry:
 *                           type: object
 *                         populationDistribution:
 *                           type: object
 *       500:
 *         description: Internal server error
 */
router.get('/stats', getDemandStats);

/**
 * @swagger
 * /api/demand/top:
 *   get:
 *     summary: Get top demand centers
 *     description: Retrieve highest-ranking demand centers by specified criteria
 *     tags: [Demand]
 *     parameters:
 *       - in: query
 *         name: criteria
 *         schema:
 *           type: string
 *           enum: [population, industrial, transport, urban, combined]
 *           default: combined
 *         description: Ranking criteria
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Maximum number of results
 *     responses:
 *       200:
 *         description: Top demand centers
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
 *                     topDemandCenters:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/DemandCenter'
 *                           - type: object
 *                             properties:
 *                               rank:
 *                                 type: integer
 *                               combinedScore:
 *                                 type: number
 *       500:
 *         description: Internal server error
 */
router.get('/top', getTopDemandCenters);

/**
 * @swagger
 * /api/demand/nearby:
 *   get:
 *     summary: Get demand centers within radius
 *     description: Find demand centers within specified distance of a location
 *     tags: [Demand]
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
 *         name: radius
 *         schema:
 *           type: number
 *           default: 200
 *         description: Search radius in kilometers
 *     responses:
 *       200:
 *         description: Nearby demand centers
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
 *                     demandCenters:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/DemandCenter'
 *                           - type: object
 *                             properties:
 *                               distance:
 *                                 type: number
 *                                 description: Distance in kilometers
 *       400:
 *         description: Invalid coordinates
 *       500:
 *         description: Internal server error
 */
router.get('/nearby', getDemandCentersNearby);

/**
 * @swagger
 * /api/demand/forecast:
 *   get:
 *     summary: Get demand forecast for area
 *     description: Generate hydrogen demand forecast for a specific geographic area
 *     tags: [Demand]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Center latitude coordinate
 *       - in: query
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *         description: Center longitude coordinate
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 200
 *         description: Analysis radius in kilometers
 *       - in: query
 *         name: years
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 30
 *           default: 10
 *         description: Number of years to forecast
 *     responses:
 *       200:
 *         description: Demand forecast
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
 *                     forecast:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           year:
 *                             type: integer
 *                           population:
 *                             type: integer
 *                           industrialDemand:
 *                             type: number
 *                           transportDemand:
 *                             type: number
 *                           estimatedHydrogenDemand:
 *                             type: number
 *                             description: Estimated hydrogen demand in kg/year
 *                           estimatedHydrogenDemandTonnes:
 *                             type: number
 *                             description: Estimated hydrogen demand in tonnes/year
 *       400:
 *         description: Invalid coordinates
 *       500:
 *         description: Internal server error
 */
router.get('/forecast', getDemandForecast);

/**
 * @swagger
 * /api/demand/refresh:
 *   post:
 *     summary: Refresh demand centers data
 *     description: Trigger a manual refresh of demand centers data from World Bank API
 *     tags: [Demand]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               countries:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: ISO country codes to refresh (optional)
 *                 example: ["US", "CA", "DE", "FR"]
 *     responses:
 *       200:
 *         description: Demand data refreshed successfully
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
 *                     demandCenters:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/DemandCenter'
 *                     count:
 *                       type: integer
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           country:
 *                             type: string
 *                           error:
 *                             type: string
 *       500:
 *         description: Failed to refresh demand data
 */
router.post('/refresh', refreshDemandData);

/**
 * @swagger
 * /api/demand/{id}:
 *   get:
 *     summary: Get a specific demand center by ID
 *     description: Retrieve detailed information about a specific demand center
 *     tags: [Demand]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Demand center ID
 *     responses:
 *       200:
 *         description: Demand center details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/DemandCenter'
 *       404:
 *         description: Demand center not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getDemandCenterById);

export default router;
