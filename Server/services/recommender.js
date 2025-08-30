import { logger } from './logger.js';
import { dataCleaner } from './dataCleaner.js';

/**
 * Recommendation engine for optimal hydrogen project site selection
 * Analyzes multiple factors to provide scored recommendations
 */
export class Recommender {
  constructor() {
    // Weighting factors for recommendation algorithm
    this.weights = {
      renewable: 0.4,    // 40% - Proximity to renewable energy sources
      demand: 0.3,       // 30% - Proximity to demand centers
      cost: 0.2,         // 20% - Cost factors (infrastructure, land, etc.)
      regulatory: 0.1    // 10% - Regulatory and policy factors
    };

    // Scoring thresholds
    this.thresholds = {
      excellentDistance: 50,    // km - Excellent proximity
      goodDistance: 100,        // km - Good proximity
      fairDistance: 200,        // km - Fair proximity
      maxDistance: 500          // km - Maximum consideration distance
    };
  }

  /**
   * Generate site recommendations based on available data
   * @param {Object} params - Recommendation parameters
   * @param {Array} params.renewableData - Renewable energy data points
   * @param {Array} params.demandData - Demand center data points
   * @param {Array} params.existingInfrastructure - Existing hydrogen infrastructure
   * @param {Object} params.boundingBox - Geographic bounds for recommendations
   * @param {number} params.maxRecommendations - Maximum number of recommendations
   * @returns {Array} Array of site recommendations with scores
   */
  async generateRecommendations({
    renewableData = [],
    demandData = [],
    existingInfrastructure = [],
    boundingBox = { south: 40, west: -120, north: 50, east: -100 },
    maxRecommendations = 10
  }) {
    try {
      logger.info('Starting recommendation generation process');

      // Generate candidate grid points within bounding box
      const candidatePoints = this.generateCandidateGrid(boundingBox, 0.5); // 0.5-degree grid
      
      // Score each candidate point
      const scoredRecommendations = await Promise.all(
        candidatePoints.map(async (point) => {
          const score = await this.calculateSiteScore(
            point,
            renewableData,
            demandData,
            existingInfrastructure
          );
          return {
            ...point,
            ...score
          };
        })
      );

      // Sort by total score and return top recommendations
      const topRecommendations = scoredRecommendations
        .filter(rec => rec.totalScore > 30) // Minimum viable score threshold
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, maxRecommendations)
        .map((rec, index) => ({
          ...rec,
          id: `rec_${Date.now()}_${index}`,
          rank: index + 1,
          lastUpdated: new Date().toISOString()
        }));

      logger.info(`Generated ${topRecommendations.length} recommendations`);
      return topRecommendations;
    } catch (error) {
      logger.error(`Failed to generate recommendations: ${error.message}`);
      throw new Error(`Recommendation generation failed: ${error.message}`);
    }
  }

  /**
   * Calculate comprehensive site score for a candidate location
   * @param {Object} point - Candidate point with lat/lon
   * @param {Array} renewableData - Renewable energy data
   * @param {Array} demandData - Demand center data
   * @param {Array} existingInfrastructure - Existing infrastructure
   * @returns {Object} Detailed scoring breakdown
   */
  async calculateSiteScore(point, renewableData, demandData, existingInfrastructure) {
    try {
      // Calculate individual factor scores
      const renewableScore = this.calculateRenewableScore(point, renewableData);
      const demandScore = this.calculateDemandScore(point, demandData);
      const costScore = this.calculateCostScore(point, existingInfrastructure);
      const regulatoryScore = this.calculateRegulatoryScore(point);

      // Calculate weighted total score
      const totalScore = (
        renewableScore * this.weights.renewable +
        demandScore * this.weights.demand +
        costScore * this.weights.cost +
        regulatoryScore * this.weights.regulatory
      );

      // Determine recommended capacity based on scores
      const recommendedCapacity = this.calculateRecommendedCapacity(
        renewableScore,
        demandScore,
        totalScore
      );

      // Estimate project cost
      const estimatedCost = this.estimateProjectCost(recommendedCapacity, costScore);

      return {
        latitude: point.latitude,
        longitude: point.longitude,
        totalScore: Math.round(totalScore * 100) / 100,
        factors: {
          renewableScore: Math.round(renewableScore * 100) / 100,
          demandScore: Math.round(demandScore * 100) / 100,
          costScore: Math.round(costScore * 100) / 100,
          regulatoryScore: Math.round(regulatoryScore * 100) / 100
        },
        recommendedCapacity, // MW
        estimatedCost, // Million USD
        viabilityRating: this.getViabilityRating(totalScore),
        keyFactors: this.identifyKeyFactors(renewableScore, demandScore, costScore, regulatoryScore)
      };
    } catch (error) {
      logger.error(`Failed to calculate site score: ${error.message}`);
      return {
        latitude: point.latitude,
        longitude: point.longitude,
        totalScore: 0,
        factors: { renewableScore: 0, demandScore: 0, costScore: 0, regulatoryScore: 0 },
        recommendedCapacity: 0,
        estimatedCost: 0,
        viabilityRating: 'Poor',
        keyFactors: []
      };
    }
  }

  /**
   * Calculate renewable energy proximity and quality score
   * @param {Object} point - Candidate location
   * @param {Array} renewableData - Renewable energy data points
   * @returns {number} Renewable score (0-100)
   */
  calculateRenewableScore(point, renewableData) {
    if (!renewableData || renewableData.length === 0) {
      return 50; // Neutral score if no data available
    }

    let maxScore = 0;
    
    for (const renewable of renewableData) {
      const distance = dataCleaner.haversineDistance(
        point.latitude,
        point.longitude,
        renewable.location?.latitude || renewable.latitude,
        renewable.location?.longitude || renewable.longitude
      );

      // Distance-based score
      let distanceScore = 0;
      if (distance <= this.thresholds.excellentDistance) distanceScore = 100;
      else if (distance <= this.thresholds.goodDistance) distanceScore = 80;
      else if (distance <= this.thresholds.fairDistance) distanceScore = 60;
      else if (distance <= this.thresholds.maxDistance) {
        distanceScore = 60 * (1 - (distance - this.thresholds.fairDistance) / 
                             (this.thresholds.maxDistance - this.thresholds.fairDistance));
      }

      // Quality-based score (from renewable resource quality)
      const qualityScore = renewable.solar?.suitabilityScore || 
                          renewable.wind?.suitabilityScore || 
                          50; // Default neutral score

      // Combined score for this renewable source
      const combinedScore = (distanceScore * 0.6) + (qualityScore * 0.4);
      maxScore = Math.max(maxScore, combinedScore);
    }

    return Math.min(100, maxScore);
  }

  /**
   * Calculate demand center proximity and size score
   * @param {Object} point - Candidate location
   * @param {Array} demandData - Demand center data points
   * @returns {number} Demand score (0-100)
   */
  calculateDemandScore(point, demandData) {
    if (!demandData || demandData.length === 0) {
      return 30; // Lower score if no demand data available
    }

    let totalScore = 0;
    let weightSum = 0;

    for (const demand of demandData) {
      const distance = dataCleaner.haversineDistance(
        point.latitude,
        point.longitude,
        demand.location?.latitude || demand.latitude,
        demand.location?.longitude || demand.longitude
      );

      if (distance <= this.thresholds.maxDistance) {
        // Distance-based score
        let distanceScore = 0;
        if (distance <= this.thresholds.excellentDistance) distanceScore = 100;
        else if (distance <= this.thresholds.goodDistance) distanceScore = 80;
        else if (distance <= this.thresholds.fairDistance) distanceScore = 60;
        else {
          distanceScore = 60 * (1 - (distance - this.thresholds.fairDistance) / 
                               (this.thresholds.maxDistance - this.thresholds.fairDistance));
        }

        // Demand size score
        const demandSize = demand.population?.total || 
                          demand.industrialDemand || 
                          demand.population?.demandScore || 
                          50;
        
        const demandSizeScore = Math.min(100, Math.log10(demandSize + 1) * 15);

        // Weight by inverse distance
        const weight = 1 / (distance + 1);
        const combinedScore = (distanceScore * 0.7) + (demandSizeScore * 0.3);
        
        totalScore += combinedScore * weight;
        weightSum += weight;
      }
    }

    return weightSum > 0 ? Math.min(100, totalScore / weightSum) : 30;
  }

  /**
   * Calculate cost-related factors score
   * @param {Object} point - Candidate location
   * @param {Array} existingInfrastructure - Existing infrastructure data
   * @returns {number} Cost score (0-100)
   */
  calculateCostScore(point, existingInfrastructure) {
    let infrastructureScore = 50; // Base score

    // Bonus for proximity to existing infrastructure
    if (existingInfrastructure && existingInfrastructure.length > 0) {
      let minDistance = Infinity;
      
      for (const infra of existingInfrastructure) {
        let infraLat, infraLon;
        
        if (infra.geometry?.type === 'Point') {
          [infraLon, infraLat] = infra.geometry.coordinates;
        } else if (infra.geometry?.type === 'LineString') {
          // Use midpoint of line
          const coords = infra.geometry.coordinates;
          const midIndex = Math.floor(coords.length / 2);
          [infraLon, infraLat] = coords[midIndex];
        } else {
          continue;
        }

        const distance = dataCleaner.haversineDistance(
          point.latitude,
          point.longitude,
          infraLat,
          infraLon
        );

        minDistance = Math.min(minDistance, distance);
      }

      // Infrastructure proximity bonus
      if (minDistance < Infinity) {
        if (minDistance <= 25) infrastructureScore += 30;
        else if (minDistance <= 50) infrastructureScore += 20;
        else if (minDistance <= 100) infrastructureScore += 10;
      }
    }

    // Geographic cost factors (simplified)
    // Favor locations that are not too remote but not in expensive urban areas
    const terrainScore = this.estimateTerrainSuitability(point);
    const accessibilityScore = this.estimateAccessibility(point);

    return Math.min(100, (infrastructureScore * 0.4) + (terrainScore * 0.3) + (accessibilityScore * 0.3));
  }

  /**
   * Calculate regulatory and policy factors score
   * @param {Object} point - Candidate location
   * @returns {number} Regulatory score (0-100)
   */
  calculateRegulatoryScore(point) {
    // Simplified regulatory scoring based on general factors
    // In a real implementation, this would include:
    // - Local hydrogen policies
    // - Environmental regulations
    // - Permitting ease
    // - Government incentives
    
    let baseScore = 70; // Assume moderate regulatory environment
    
    // Geographic adjustments (simplified)
    // These would be replaced with actual policy data
    if (point.latitude > 45) baseScore += 10; // Northern regions often have better hydrogen policies
    if (point.longitude < -100) baseScore += 5; // Western regions
    
    // Add some variability based on location
    const locationVariability = (Math.sin(point.latitude) + Math.cos(point.longitude)) * 10;
    
    return Math.max(20, Math.min(100, baseScore + locationVariability));
  }

  /**
   * Generate candidate grid points within bounding box
   * @param {Object} boundingBox - Geographic bounds
   * @param {number} resolution - Grid resolution in degrees
   * @returns {Array} Array of candidate points
   */
  generateCandidateGrid(boundingBox, resolution = 0.5) {
    const candidates = [];
    
    for (let lat = boundingBox.south; lat <= boundingBox.north; lat += resolution) {
      for (let lon = boundingBox.west; lon <= boundingBox.east; lon += resolution) {
        candidates.push({
          latitude: Math.round(lat * 100) / 100,
          longitude: Math.round(lon * 100) / 100
        });
      }
    }
    
    return candidates;
  }

  /**
   * Calculate recommended capacity based on scores
   * @param {number} renewableScore - Renewable energy score
   * @param {number} demandScore - Demand score
   * @param {number} totalScore - Total site score
   * @returns {number} Recommended capacity in MW
   */
  calculateRecommendedCapacity(renewableScore, demandScore, totalScore) {
    const baseCapacity = 50; // Base capacity in MW
    const scaleFactor = (renewableScore + demandScore) / 200; // 0-1 scale
    const totalScaleFactor = totalScore / 100; // 0-1 scale
    
    return Math.round(baseCapacity * scaleFactor * totalScaleFactor * 2); // Up to 100MW
  }

  /**
   * Estimate project cost based on capacity and cost factors
   * @param {number} capacity - Project capacity in MW
   * @param {number} costScore - Cost score (higher = lower cost)
   * @returns {number} Estimated cost in million USD
   */
  estimateProjectCost(capacity, costScore) {
    const costPerMW = 4; // Base cost of 4M USD per MW
    const costMultiplier = 2 - (costScore / 100); // Lower cost score = higher multiplier
    
    return Math.round(capacity * costPerMW * costMultiplier * 100) / 100;
  }

  /**
   * Get viability rating based on total score
   * @param {number} totalScore - Total recommendation score
   * @returns {string} Viability rating
   */
  getViabilityRating(totalScore) {
    if (totalScore >= 80) return 'Excellent';
    if (totalScore >= 65) return 'Good';
    if (totalScore >= 50) return 'Fair';
    if (totalScore >= 30) return 'Poor';
    return 'Not Viable';
  }

  /**
   * Identify key factors affecting the recommendation
   * @param {number} renewableScore - Renewable score
   * @param {number} demandScore - Demand score
   * @param {number} costScore - Cost score
   * @param {number} regulatoryScore - Regulatory score
   * @returns {Array} Array of key factors
   */
  identifyKeyFactors(renewableScore, demandScore, costScore, regulatoryScore) {
    const factors = [];
    
    if (renewableScore >= 80) factors.push('Excellent renewable resources');
    else if (renewableScore <= 40) factors.push('Limited renewable resources');
    
    if (demandScore >= 80) factors.push('High demand proximity');
    else if (demandScore <= 40) factors.push('Remote from demand centers');
    
    if (costScore >= 80) factors.push('Low infrastructure costs');
    else if (costScore <= 40) factors.push('High infrastructure costs');
    
    if (regulatoryScore >= 80) factors.push('Favorable regulations');
    else if (regulatoryScore <= 40) factors.push('Regulatory challenges');
    
    return factors;
  }

  /**
   * Estimate terrain suitability (simplified)
   * @param {Object} point - Location point
   * @returns {number} Terrain score (0-100)
   */
  estimateTerrainSuitability(point) {
    // Simplified terrain scoring
    // In reality, this would use elevation and terrain data
    const terrainVariability = Math.abs(Math.sin(point.latitude * 2) * Math.cos(point.longitude * 2)) * 30;
    return Math.max(40, 80 - terrainVariability);
  }

  /**
   * Estimate accessibility (simplified)
   * @param {Object} point - Location point
   * @returns {number} Accessibility score (0-100)
   */
  estimateAccessibility(point) {
    // Simplified accessibility scoring
    // In reality, this would consider roads, ports, railways
    const accessibilityBase = 60;
    const locationFactor = (Math.abs(point.latitude - 40) + Math.abs(point.longitude + 95)) / 20;
    return Math.max(30, Math.min(90, accessibilityBase + (20 - locationFactor * 5)));
  }
}

// Export singleton instance
export const recommender = new Recommender();
