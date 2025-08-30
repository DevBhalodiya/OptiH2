import express from 'express';
import {
  getRecommendations,
  getRecommendationAnalysis,
  compareRecommendations,
  getOptimizationParameters,
  updateOptimizationWeights
} from '../controllers/recommendationsController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Recommendation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the recommendation
 *         latitude:
 *           type: number
 *           description: Recommended site latitude
 *         longitude:
 *           type: number
 *           description: Recommended site longitude
 *         totalScore:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Overall site suitability score
 *         factors:
 *           type: object
 *           properties:
 *             renewableScore:
 *               type: number
 *               minimum: 0
 *               maximum: 100
 *             demandScore:
 *               type: number
 *               minimum: 0
 *               maximum: 100
 *             costScore:
 *               type: number
 *               minimum: 0
 *               maximum: 100
 *             regulatoryScore:
 *               type: number
 *               minimum: 0
 *               maximum: 100
 *         recommendedCapacity:
 *           type: number
 *           description: Recommended plant capacity in MW
 *         estimatedCost:
 *           type: number
 *           description: Estimated project cost in million USD
 *         viabilityRating:
 *           type: string
 *           enum: [Excellent, Good, Fair, Poor, Not Viable]
 *         keyFactors:
 *           type: array
 *           items:
 *             type: string
 *           description: Key factors affecting the recommendation
 *         rank:
 *           type: integer
 *           description: Ranking among all recommendations
 *         lastUpdated:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/recommendations:
 *   get:
 *     summary: Get hydrogen project site recommendations
 *     description: Generate optimal site recommendations for hydrogen projects within a bounding box
 *     tags: [Recommendations]
 *     parameters:
 *       - in: query
 *         name: south
 *         required: true
 *         schema:
 *           type: number
 *         description: Southern boundary latitude
 *       - in: query
 *         name: west
 *         required: true
 *         schema:
 *           type: number
 *         description: Western boundary longitude
 *       - in: query
 *         name: north
 *         required: true
 *         schema:
 *           type: number
 *         description: Northern boundary latitude
 *       - in: query
 *         name: east
 *         required: true
 *         schema:
 *           type: number
 *         description: Eastern boundary longitude
 *       - in: query
 *         name: maxRecommendations
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Maximum number of recommendations to return
 *       - in: query
 *         name: minScore
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           default: 30
 *         description: Minimum viability score threshold
 *       - in: query
 *         name: projectType
 *         schema:
 *           type: string
 *           enum: [production, storage, distribution]
 *         description: Type of hydrogen project for specialized scoring
 *     responses:
 *       200:
 *         description: Site recommendations generated successfully
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
 *                     recommendations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Recommendation'
 *                     count:
 *                       type: integer
 *                     parameters:
 *                       type: object
 *                       properties:
 *                         boundingBox:
 *                           type: object
 *                         maxRecommendations:
 *                           type: integer
 *                         minScore:
 *                           type: number
 *                         projectType:
 *                           type: string
 *                     dataStatus:
 *                       type: object
 *                       properties:
 *                         renewableSources:
 *                           type: integer
 *                         demandCenters:
 *                           type: integer
 *                         existingInfrastructure:
 *                           type: integer
 *       400:
 *         description: Invalid bounding box coordinates
 *       500:
 *         description: Failed to generate recommendations
 */
router.get('/', getRecommendations);

/**
 * @swagger
 * /api/recommendations/parameters:
 *   get:
 *     summary: Get optimization parameters
 *     description: Retrieve current algorithm weights and scoring parameters
 *     tags: [Recommendations]
 *     responses:
 *       200:
 *         description: Optimization parameters
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
 *                     parameters:
 *                       type: object
 *                       properties:
 *                         weights:
 *                           type: object
 *                           properties:
 *                             renewable:
 *                               type: number
 *                             demand:
 *                               type: number
 *                             cost:
 *                               type: number
 *                             regulatory:
 *                               type: number
 *                         thresholds:
 *                           type: object
 *                         scoringFactors:
 *                           type: object
 *       500:
 *         description: Internal server error
 */
router.get('/parameters', getOptimizationParameters);

/**
 * @swagger
 * /api/recommendations/parameters:
 *   put:
 *     summary: Update optimization weights
 *     description: Update algorithm weighting factors (admin function)
 *     tags: [Recommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - renewable
 *               - demand
 *               - cost
 *               - regulatory
 *             properties:
 *               renewable:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 description: Weight for renewable energy factors (must sum to 1.0)
 *               demand:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 description: Weight for demand center factors
 *               cost:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 description: Weight for cost factors
 *               regulatory:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 1
 *                 description: Weight for regulatory factors
 *             example:
 *               renewable: 0.4
 *               demand: 0.3
 *               cost: 0.2
 *               regulatory: 0.1
 *     responses:
 *       200:
 *         description: Weights updated successfully
 *       400:
 *         description: Invalid weights (must be numbers and sum to 1.0)
 *       500:
 *         description: Failed to update weights
 */
router.put('/parameters', updateOptimizationWeights);

/**
 * @swagger
 * /api/recommendations/analyze/{lat}/{lon}:
 *   get:
 *     summary: Get detailed site analysis
 *     description: Generate comprehensive analysis for a specific location
 *     tags: [Recommendations]
 *     parameters:
 *       - in: path
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Site latitude
 *       - in: path
 *         name: lon
 *         required: true
 *         schema:
 *           type: number
 *         description: Site longitude
 *     responses:
 *       200:
 *         description: Detailed site analysis
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
 *                     siteScore:
 *                       type: object
 *                       description: Detailed scoring breakdown
 *                     nearbyAnalysis:
 *                       type: object
 *                       properties:
 *                         renewableResources:
 *                           type: array
 *                         demandCenters:
 *                           type: array
 *                         existingPlants:
 *                           type: array
 *                     economicAnalysis:
 *                       type: object
 *                       properties:
 *                         capitalCosts:
 *                           type: object
 *                         operationalBenefits:
 *                           type: object
 *                         paybackPeriod:
 *                           type: number
 *                     environmentalAnalysis:
 *                       type: object
 *                       properties:
 *                         carbonReduction:
 *                           type: object
 *                         sustainabilityScore:
 *                           type: number
 *                     riskAnalysis:
 *                       type: object
 *                       properties:
 *                         technicalRisks:
 *                           type: object
 *                         marketRisks:
 *                           type: object
 *                         overallRiskScore:
 *                           type: number
 *       400:
 *         description: Invalid coordinates
 *       500:
 *         description: Failed to generate analysis
 */
router.get('/analyze/:lat/:lon', getRecommendationAnalysis);

/**
 * @swagger
 * /api/recommendations/compare:
 *   post:
 *     summary: Compare multiple recommendation sites
 *     description: Compare and rank multiple potential sites side-by-side
 *     tags: [Recommendations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sites
 *             properties:
 *               sites:
 *                 type: array
 *                 minItems: 2
 *                 maxItems: 10
 *                 items:
 *                   type: object
 *                   required:
 *                     - latitude
 *                     - longitude
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Optional site identifier
 *                     name:
 *                       type: string
 *                       description: Optional site name
 *                     latitude:
 *                       type: number
 *                     longitude:
 *                       type: number
 *             example:
 *               sites:
 *                 - id: "site1"
 *                   name: "Texas Site"
 *                   latitude: 32.7767
 *                   longitude: -96.7970
 *                 - id: "site2"
 *                   name: "California Site"
 *                   latitude: 34.0522
 *                   longitude: -118.2437
 *     responses:
 *       200:
 *         description: Site comparison completed
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
 *                     comparisons:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           siteId:
 *                             type: string
 *                           siteName:
 *                             type: string
 *                           location:
 *                             type: object
 *                           scores:
 *                             type: object
 *                           rank:
 *                             type: integer
 *                     summary:
 *                       type: object
 *                       properties:
 *                         bestSite:
 *                           type: object
 *                         worstSite:
 *                           type: object
 *                         averageScores:
 *                           type: object
 *       400:
 *         description: Invalid sites data (need at least 2 valid sites)
 *       500:
 *         description: Failed to compare sites
 */
router.post('/compare', compareRecommendations);

export default router;
