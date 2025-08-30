import express from 'express';
import {
  getAllPipelines,
  getPipelineById,
  getPipelinesStats,
  getPipelinesNetwork,
  refreshPipelinesData,
  getPipelinesInRoute
} from '../controllers/pipelinesController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Pipeline:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the pipeline
 *         name:
 *           type: string
 *           description: Name of the hydrogen pipeline
 *         geometry:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [LineString, Point]
 *             coordinates:
 *               type: array
 *               items:
 *                 type: array
 *                 items:
 *                   type: number
 *                 minItems: 2
 *                 maxItems: 2
 *               description: Array of [longitude, latitude] coordinates
 *         properties:
 *           type: object
 *           properties:
 *             length:
 *               type: number
 *               description: Pipeline length in kilometers
 *             capacity:
 *               type: number
 *               description: Pipeline capacity
 *             status:
 *               type: string
 *               enum: [operational, planned, under_construction, decommissioned]
 *             operationalType:
 *               type: string
 *               description: Type of pipeline operation
 *         lastUpdated:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/pipelines:
 *   get:
 *     summary: Get all hydrogen pipelines
 *     description: Retrieve a list of all hydrogen transportation pipelines with optional filtering
 *     tags: [Pipelines]
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
 *         name: minLength
 *         schema:
 *           type: number
 *         description: Minimum pipeline length in kilometers
 *       - in: query
 *         name: maxLength
 *         schema:
 *           type: number
 *         description: Maximum pipeline length in kilometers
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [operational, planned, under_construction, decommissioned]
 *         description: Filter by pipeline status
 *     responses:
 *       200:
 *         description: List of hydrogen pipelines
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
 *                     pipelines:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Pipeline'
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
router.get('/', getAllPipelines);

/**
 * @swagger
 * /api/pipelines/stats:
 *   get:
 *     summary: Get hydrogen pipelines statistics
 *     description: Retrieve statistical information about hydrogen pipelines
 *     tags: [Pipelines]
 *     responses:
 *       200:
 *         description: Pipelines statistics
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
 *                         totalLength:
 *                           type: number
 *                         averageLength:
 *                           type: number
 *                         lengthDistribution:
 *                           type: object
 *       500:
 *         description: Internal server error
 */
router.get('/stats', getPipelinesStats);

/**
 * @swagger
 * /api/pipelines/network:
 *   get:
 *     summary: Get pipeline network analysis
 *     description: Retrieve network connectivity analysis of hydrogen pipelines
 *     tags: [Pipelines]
 *     responses:
 *       200:
 *         description: Pipeline network analysis
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
 *                     networkAnalysis:
 *                       type: object
 *                       properties:
 *                         totalPipelines:
 *                           type: integer
 *                         totalLength:
 *                           type: number
 *                         majorHubs:
 *                           type: array
 *                         networkDensity:
 *                           type: number
 *       500:
 *         description: Internal server error
 */
router.get('/network', getPipelinesNetwork);

/**
 * @swagger
 * /api/pipelines/route:
 *   get:
 *     summary: Get pipelines within a specific route
 *     description: Find hydrogen pipelines within a corridor between two points
 *     tags: [Pipelines]
 *     parameters:
 *       - in: query
 *         name: startLat
 *         required: true
 *         schema:
 *           type: number
 *         description: Starting latitude
 *       - in: query
 *         name: startLon
 *         required: true
 *         schema:
 *           type: number
 *         description: Starting longitude
 *       - in: query
 *         name: endLat
 *         required: true
 *         schema:
 *           type: number
 *         description: Ending latitude
 *       - in: query
 *         name: endLon
 *         required: true
 *         schema:
 *           type: number
 *         description: Ending longitude
 *       - in: query
 *         name: corridor
 *         schema:
 *           type: number
 *           default: 50
 *         description: Corridor width in kilometers
 *     responses:
 *       200:
 *         description: Pipelines within route corridor
 *       400:
 *         description: Invalid coordinates
 *       500:
 *         description: Internal server error
 */
router.get('/route', getPipelinesInRoute);

/**
 * @swagger
 * /api/pipelines/refresh:
 *   post:
 *     summary: Refresh pipelines data from external sources
 *     description: Trigger a manual refresh of hydrogen pipelines data from OpenStreetMap
 *     tags: [Pipelines]
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
 *         description: Pipelines data refreshed successfully
 *       400:
 *         description: Invalid bounding box coordinates
 *       500:
 *         description: Failed to refresh pipelines data
 */
router.post('/refresh', refreshPipelinesData);

/**
 * @swagger
 * /api/pipelines/{id}:
 *   get:
 *     summary: Get a specific hydrogen pipeline by ID
 *     description: Retrieve detailed information about a specific hydrogen pipeline
 *     tags: [Pipelines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pipeline ID
 *     responses:
 *       200:
 *         description: Pipeline details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Pipeline'
 *       404:
 *         description: Pipeline not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getPipelineById);

export default router;
