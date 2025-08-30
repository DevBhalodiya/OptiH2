import { dataStore } from '../jobs/cronFetch.js';
import { recommender } from '../services/recommender.js';
import { logger } from '../services/logger.js';

/**
 * Controller for hydrogen project site recommendations
 * Handles optimization and recommendation algorithms for project placement
 */

/**
 * Get site recommendations for hydrogen projects
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getRecommendations = async (req, res) => {
  try {
    const { 
      south, 
      west, 
      north, 
      east, 
      maxRecommendations,
      minScore,
      projectType 
    } = req.query;

    // Validate bounding box
    if (!south || !west || !north || !east) {
      return res.status(400).json({
        success: false,
        error: 'Bounding box coordinates (south, west, north, east) are required'
      });
    }

    const boundingBox = {
      south: parseFloat(south),
      west: parseFloat(west),
      north: parseFloat(north),
      east: parseFloat(east)
    };

    // Validate coordinates
    if (Object.values(boundingBox).some(coord => isNaN(coord))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid bounding box coordinates provided'
      });
    }

    const maxRecs = parseInt(maxRecommendations) || 10;
    const minimumScore = parseFloat(minScore) || 30;

    // Prepare data for recommendation engine
    const recommendationParams = {
      renewableData: dataStore.renewables,
      demandData: dataStore.demand,
      existingInfrastructure: [...dataStore.plants, ...dataStore.pipelines],
      boundingBox,
      maxRecommendations: maxRecs
    };

    // Generate recommendations
    const recommendations = await recommender.generateRecommendations(recommendationParams);

    // Filter by minimum score if specified
    const filteredRecommendations = recommendations.filter(rec => 
      rec.totalScore >= minimumScore
    );

    // Add project type specific adjustments if provided
    const enhancedRecommendations = filteredRecommendations.map(rec => ({
      ...rec,
      projectTypeAdjustments: projectType ? 
        calculateProjectTypeAdjustments(rec, projectType) : null
    }));

    res.json({
      success: true,
      data: {
        recommendations: enhancedRecommendations,
        count: enhancedRecommendations.length,
        parameters: {
          boundingBox,
          maxRecommendations: maxRecs,
          minScore: minimumScore,
          projectType
        },
        dataStatus: {
          renewableSources: dataStore.renewables.length,
          demandCenters: dataStore.demand.length,
          existingInfrastructure: dataStore.plants.length + dataStore.pipelines.length
        },
        generatedAt: new Date().toISOString()
      }
    });

    logger.info(`Generated ${enhancedRecommendations.length} site recommendations for bounding box: ${JSON.stringify(boundingBox)}`);
  } catch (error) {
    logger.error(`Error generating recommendations: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to generate site recommendations'
    });
  }
};

/**
 * Get detailed analysis for a specific recommendation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getRecommendationAnalysis = async (req, res) => {
  try {
    const { lat, lon } = req.params;
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid latitude or longitude provided'
      });
    }

    // Generate detailed analysis for specific location
    const analysisPoint = { latitude, longitude };
    
    const detailedScore = await recommender.calculateSiteScore(
      analysisPoint,
      dataStore.renewables,
      dataStore.demand,
      [...dataStore.plants, ...dataStore.pipelines]
    );

    // Find nearby resources and infrastructure
    const nearbyAnalysis = {
      renewableResources: findNearbyResources(latitude, longitude, dataStore.renewables, 100),
      demandCenters: findNearbyResources(latitude, longitude, dataStore.demand, 200),
      existingPlants: findNearbyResources(latitude, longitude, dataStore.plants, 150),
      existingPipelines: findNearbyPipelines(latitude, longitude, dataStore.pipelines, 100)
    };

    // Economic analysis
    const economicAnalysis = calculateEconomicAnalysis(detailedScore, nearbyAnalysis);

    // Environmental analysis
    const environmentalAnalysis = calculateEnvironmentalAnalysis(latitude, longitude, nearbyAnalysis);

    // Risk analysis
    const riskAnalysis = calculateRiskAnalysis(detailedScore, nearbyAnalysis);

    res.json({
      success: true,
      data: {
        location: { latitude, longitude },
        siteScore: detailedScore,
        nearbyAnalysis,
        economicAnalysis,
        environmentalAnalysis,
        riskAnalysis,
        generatedAt: new Date().toISOString()
      }
    });

    logger.info(`Generated detailed analysis for location: ${latitude}, ${longitude}`);
  } catch (error) {
    logger.error(`Error generating recommendation analysis: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendation analysis'
    });
  }
};

/**
 * Compare multiple recommendation sites
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const compareRecommendations = async (req, res) => {
  try {
    const { sites } = req.body;

    if (!sites || !Array.isArray(sites) || sites.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'At least 2 sites are required for comparison'
      });
    }

    // Validate site coordinates
    const validSites = sites.filter(site => 
      typeof site.latitude === 'number' && 
      typeof site.longitude === 'number' &&
      !isNaN(site.latitude) && 
      !isNaN(site.longitude)
    );

    if (validSites.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'At least 2 valid sites with coordinates are required'
      });
    }

    // Generate comparison analysis
    const comparisons = await Promise.all(
      validSites.map(async (site, index) => {
        const siteScore = await recommender.calculateSiteScore(
          site,
          dataStore.renewables,
          dataStore.demand,
          [...dataStore.plants, ...dataStore.pipelines]
        );

        const nearbyAnalysis = {
          renewableResources: findNearbyResources(site.latitude, site.longitude, dataStore.renewables, 100),
          demandCenters: findNearbyResources(site.latitude, site.longitude, dataStore.demand, 200),
          existingPlants: findNearbyResources(site.latitude, site.longitude, dataStore.plants, 150)
        };

        return {
          siteId: site.id || `site_${index + 1}`,
          siteName: site.name || `Site ${index + 1}`,
          location: { latitude: site.latitude, longitude: site.longitude },
          scores: siteScore,
          nearbyCount: {
            renewableResources: nearbyAnalysis.renewableResources.length,
            demandCenters: nearbyAnalysis.demandCenters.length,
            existingPlants: nearbyAnalysis.existingPlants.length
          }
        };
      })
    );

    // Rank sites by total score
    const rankedComparisons = comparisons
      .sort((a, b) => b.scores.totalScore - a.scores.totalScore)
      .map((comp, index) => ({
        ...comp,
        rank: index + 1
      }));

    // Generate comparison summary
    const comparisonSummary = {
      bestSite: rankedComparisons[0],
      worstSite: rankedComparisons[rankedComparisons.length - 1],
      averageScores: {
        totalScore: rankedComparisons.reduce((sum, comp) => sum + comp.scores.totalScore, 0) / rankedComparisons.length,
        renewableScore: rankedComparisons.reduce((sum, comp) => sum + comp.scores.factors.renewableScore, 0) / rankedComparisons.length,
        demandScore: rankedComparisons.reduce((sum, comp) => sum + comp.scores.factors.demandScore, 0) / rankedComparisons.length,
        costScore: rankedComparisons.reduce((sum, comp) => sum + comp.scores.factors.costScore, 0) / rankedComparisons.length
      },
      scoreRanges: {
        totalScore: {
          min: Math.min(...rankedComparisons.map(c => c.scores.totalScore)),
          max: Math.max(...rankedComparisons.map(c => c.scores.totalScore))
        }
      }
    };

    res.json({
      success: true,
      data: {
        comparisons: rankedComparisons,
        summary: comparisonSummary,
        count: rankedComparisons.length,
        generatedAt: new Date().toISOString()
      }
    });

    logger.info(`Compared ${rankedComparisons.length} recommendation sites`);
  } catch (error) {
    logger.error(`Error comparing recommendations: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to compare recommendation sites'
    });
  }
};

/**
 * Get optimization parameters and weights
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getOptimizationParameters = async (req, res) => {
  try {
    const parameters = {
      weights: recommender.weights,
      thresholds: recommender.thresholds,
      scoringFactors: {
        renewable: {
          description: 'Proximity and quality of renewable energy sources',
          weight: recommender.weights.renewable,
          factors: ['Solar irradiance', 'Wind speed', 'Distance to resources']
        },
        demand: {
          description: 'Proximity to hydrogen demand centers',
          weight: recommender.weights.demand,
          factors: ['Population density', 'Industrial areas', 'Transportation hubs']
        },
        cost: {
          description: 'Infrastructure and development costs',
          weight: recommender.weights.cost,
          factors: ['Existing infrastructure', 'Terrain suitability', 'Accessibility']
        },
        regulatory: {
          description: 'Regulatory and policy environment',
          weight: recommender.weights.regulatory,
          factors: ['Policy support', 'Permitting ease', 'Environmental regulations']
        }
      },
      distanceThresholds: {
        excellent: `≤ ${recommender.thresholds.excellentDistance}km`,
        good: `≤ ${recommender.thresholds.goodDistance}km`,
        fair: `≤ ${recommender.thresholds.fairDistance}km`,
        maximum: `≤ ${recommender.thresholds.maxDistance}km`
      },
      scoringScale: {
        range: '0-100',
        excellent: '80-100',
        good: '60-79',
        fair: '40-59',
        poor: '20-39',
        nonViable: '0-19'
      }
    };

    res.json({
      success: true,
      data: {
        parameters,
        version: '1.0.0',
        lastUpdated: new Date().toISOString()
      }
    });

    logger.info('Retrieved optimization parameters');
  } catch (error) {
    logger.error(`Error getting optimization parameters: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve optimization parameters'
    });
  }
};

/**
 * Update optimization weights (for admin use)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateOptimizationWeights = async (req, res) => {
  try {
    const { renewable, demand, cost, regulatory } = req.body;

    // Validate weights
    if (typeof renewable !== 'number' || typeof demand !== 'number' ||
        typeof cost !== 'number' || typeof regulatory !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'All weight values must be numbers'
      });
    }

    // Check if weights sum to 1.0 (with tolerance)
    const totalWeight = renewable + demand + cost + regulatory;
    if (Math.abs(totalWeight - 1.0) > 0.01) {
      return res.status(400).json({
        success: false,
        error: 'Weights must sum to 1.0'
      });
    }

    // Update weights
    const oldWeights = { ...recommender.weights };
    recommender.weights.renewable = renewable;
    recommender.weights.demand = demand;
    recommender.weights.cost = cost;
    recommender.weights.regulatory = regulatory;

    res.json({
      success: true,
      data: {
        oldWeights,
        newWeights: recommender.weights,
        updatedAt: new Date().toISOString()
      }
    });

    logger.info(`Updated optimization weights: ${JSON.stringify(recommender.weights)}`);
  } catch (error) {
    logger.error(`Error updating optimization weights: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Failed to update optimization weights'
    });
  }
};

/**
 * Calculate project type specific adjustments
 * @param {Object} recommendation - Base recommendation
 * @param {string} projectType - Type of hydrogen project
 * @returns {Object} Project type adjustments
 */
function calculateProjectTypeAdjustments(recommendation, projectType) {
  const adjustments = {
    originalScore: recommendation.totalScore,
    adjustedScore: recommendation.totalScore,
    adjustmentFactors: {},
    recommendedModifications: []
  };

  switch (projectType.toLowerCase()) {
    case 'production':
      // Favor renewable resources more heavily
      if (recommendation.factors.renewableScore > 70) {
        adjustments.adjustedScore += 5;
        adjustments.adjustmentFactors.renewableBonus = 5;
      }
      adjustments.recommendedModifications.push('Optimize for renewable energy proximity');
      break;

    case 'storage':
      // Favor existing infrastructure
      if (recommendation.factors.costScore > 70) {
        adjustments.adjustedScore += 3;
        adjustments.adjustmentFactors.infrastructureBonus = 3;
      }
      adjustments.recommendedModifications.push('Consider underground storage potential');
      break;

    case 'distribution':
      // Favor demand centers
      if (recommendation.factors.demandScore > 70) {
        adjustments.adjustedScore += 4;
        adjustments.adjustmentFactors.demandBonus = 4;
      }
      adjustments.recommendedModifications.push('Optimize for demand center connectivity');
      break;

    default:
      adjustments.recommendedModifications.push('General hydrogen facility considerations');
  }

  adjustments.adjustedScore = Math.min(100, adjustments.adjustedScore);
  return adjustments;
}

/**
 * Find nearby resources within specified radius
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {Array} resources - Array of resources to search
 * @param {number} radius - Search radius in km
 * @returns {Array} Nearby resources with distances
 */
function findNearbyResources(lat, lon, resources, radius) {
  return resources
    .map(resource => {
      const resourceLat = resource.location?.latitude || resource.latitude || 0;
      const resourceLon = resource.location?.longitude || resource.longitude || 0;
      
      const distance = Math.sqrt(
        Math.pow(lat - resourceLat, 2) + Math.pow(lon - resourceLon, 2)
      ) * 111; // Rough km conversion
      
      return { ...resource, distance };
    })
    .filter(resource => resource.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Find nearby pipelines within specified radius
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {Array} pipelines - Array of pipelines to search
 * @param {number} radius - Search radius in km
 * @returns {Array} Nearby pipelines with distances
 */
function findNearbyPipelines(lat, lon, pipelines, radius) {
  return pipelines
    .map(pipeline => {
      let minDistance = Infinity;
      
      if (pipeline.geometry?.type === 'LineString') {
        // Find minimum distance to any point on the pipeline
        pipeline.geometry.coordinates.forEach(coord => {
          const distance = Math.sqrt(
            Math.pow(lat - coord[1], 2) + Math.pow(lon - coord[0], 2)
          ) * 111;
          minDistance = Math.min(minDistance, distance);
        });
      }
      
      return { ...pipeline, distance: minDistance };
    })
    .filter(pipeline => pipeline.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Calculate economic analysis for a site
 * @param {Object} siteScore - Site scoring data
 * @param {Object} nearbyAnalysis - Nearby resources analysis
 * @returns {Object} Economic analysis
 */
function calculateEconomicAnalysis(siteScore, nearbyAnalysis) {
  const analysis = {
    capitalCosts: {
      estimated: siteScore.estimatedCost,
      factors: {
        baseCost: siteScore.estimatedCost * 0.7,
        infrastructurePremium: siteScore.estimatedCost * 0.2,
        locationPremium: siteScore.estimatedCost * 0.1
      }
    },
    operationalBenefits: {
      renewableAccess: nearbyAnalysis.renewableResources.length * 5, // Cost savings per year
      demandProximity: nearbyAnalysis.demandCenters.length * 3,
      infrastructureSynergy: nearbyAnalysis.existingPlants.length * 2
    },
    paybackPeriod: Math.max(5, 15 - (siteScore.totalScore / 10)), // Years
    npvEstimate: siteScore.estimatedCost * (siteScore.totalScore / 100) * 1.5 // Simplified NPV
  };

  return analysis;
}

/**
 * Calculate environmental analysis for a site
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {Object} nearbyAnalysis - Nearby resources analysis
 * @returns {Object} Environmental analysis
 */
function calculateEnvironmentalAnalysis(lat, lon, nearbyAnalysis) {
  const analysis = {
    carbonReduction: {
      annualSavings: nearbyAnalysis.demandCenters.length * 1000, // tonnes CO2/year
      lifeTimeSavings: nearbyAnalysis.demandCenters.length * 1000 * 20 // 20-year lifetime
    },
    environmentalRisks: {
      waterUsage: 'Moderate', // Would be calculated based on local water resources
      landUse: 'Low', // Hydrogen facilities have small footprint
      noiseImpact: 'Low',
      visualImpact: 'Moderate'
    },
    sustainabilityScore: Math.min(100, nearbyAnalysis.renewableResources.length * 20)
  };

  return analysis;
}

/**
 * Calculate risk analysis for a site
 * @param {Object} siteScore - Site scoring data
 * @param {Object} nearbyAnalysis - Nearby resources analysis
 * @returns {Object} Risk analysis
 */
function calculateRiskAnalysis(siteScore, nearbyAnalysis) {
  const analysis = {
    technicalRisks: {
      renewableReliability: siteScore.factors.renewableScore > 70 ? 'Low' : 'Medium',
      infrastructureRisk: nearbyAnalysis.existingPlants.length > 0 ? 'Low' : 'Medium',
      scalabilityRisk: siteScore.recommendedCapacity > 50 ? 'Medium' : 'Low'
    },
    marketRisks: {
      demandUncertainty: nearbyAnalysis.demandCenters.length > 2 ? 'Low' : 'High',
      competitionRisk: nearbyAnalysis.existingPlants.length > 2 ? 'High' : 'Low',
      pricingRisk: 'Medium' // Hydrogen market still developing
    },
    regulatoryRisks: {
      permittingRisk: siteScore.factors.regulatoryScore > 70 ? 'Low' : 'Medium',
      policyChangeRisk: 'Medium', // Policy landscape evolving
      environmentalComplianceRisk: 'Low' // Hydrogen is clean energy
    },
    overallRiskScore: Math.max(1, 10 - (siteScore.totalScore / 10)) // 1-10 scale
  };

  return analysis;
}
