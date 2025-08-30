import express from 'express';
import {
  getAllPlants,
  getPlantById,
  getPlantsStats,
  refreshPlantsData,
  addPlant
} from '../controllers/plantsController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Plant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the plant
 *         name:
 *           type: string
 *           description: Name of the hydrogen plant
 *         geometry:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [Point]
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               minItems: 2
 *               maxItems: 2
 *               description: [longitude, latitude]
 *         properties:
 *           type: object
 *           properties:
 *             capacity:
 *               type: number
 *               description: Plant capacity in MW
 *             status:
 *               type: string
 *               enum: [operational, planned, under_construction, decommissioned]
 *             operationalType:
 *               type: string
 *               enum: [production, storage, distribution, hydrogen]
 *         lastUpdated:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/plants:
 *   get:
 *     summary: Get all hydrogen plants
 *     description: Retrieve a list of all hydrogen production facilities with optional filtering
 *     tags: [Plants]
 *     parameters:
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Latitude for location-based filtering
 *       - in: query
 *         name: lon
 *         schema:
 *           type: number
 *         description: Longitude for location-based filtering
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 100
 *         description: Search radius in kilometers (when lat/lon provided)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by operational type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [operational, planned, under_construction, decommissioned]
 *         description: Filter by plant status
 *     responses:
 *       200:
 *         description: List of hydrogen plants
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
 *                     plants:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Plant'
 *                     count:
 *                       type: integer
 *                     lastUpdated:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllPlants);

/**
 * @swagger
 * /api/plants/stats:
 *   get:
 *     summary: Get hydrogen plants statistics
 *     description: Retrieve statistical information about hydrogen plants
 *     tags: [Plants]
 *     responses:
 *       200:
 *         description: Plants statistics
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
 *                         byStatus:
 *                           type: object
 *                         byType:
 *                           type: object
 *                         totalCapacity:
 *                           type: number
 *                         averageCapacity:
 *                           type: number
 *       500:
 *         description: Internal server error
 */
router.get('/stats', getPlantsStats);

/**
 * @swagger
 * /api/plants/refresh:
 *   post:
 *     summary: Refresh plants data from external sources
 *     description: Trigger a manual refresh of hydrogen plants data from OpenStreetMap
 *     tags: [Plants]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bbox:
 *                 type: object
 *                 properties:
 *                   south:
 *                     type: number
 *                   west:
 *                     type: number
 *                   north:
 *                     type: number
 *                   east:
 *                     type: number
 *     responses:
 *       200:
 *         description: Plants data refreshed successfully
 *       400:
 *         description: Invalid bounding box coordinates
 *       500:
 *         description: Failed to refresh plants data
 */
router.post('/refresh', refreshPlantsData);

/**
 * @swagger
 * /api/plants:
 *   post:
 *     summary: Add a new hydrogen plant
 *     description: Add a new hydrogen plant to the database (user submissions)
 *     tags: [Plants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - latitude
 *               - longitude
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the hydrogen plant
 *               latitude:
 *                 type: number
 *                 description: Latitude coordinate
 *               longitude:
 *                 type: number
 *                 description: Longitude coordinate
 *               capacity:
 *                 type: number
 *                 description: Plant capacity in MW
 *               type:
 *                 type: string
 *                 description: Operational type
 *               status:
 *                 type: string
 *                 enum: [operational, planned, under_construction]
 *                 default: planned
 *     responses:
 *       201:
 *         description: Plant added successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Failed to add plant
 */
router.post('/', addPlant);

/**
 * @swagger
 * /api/plants/{id}:
 *   get:
 *     summary: Get a specific hydrogen plant by ID
 *     description: Retrieve detailed information about a specific hydrogen plant
 *     tags: [Plants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Plant ID
 *     responses:
 *       200:
 *         description: Plant details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Plant'
 *       404:
 *         description: Plant not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getPlantById);

export default router;
