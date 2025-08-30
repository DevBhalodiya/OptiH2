# OptiH2 Backend Server

Green Hydrogen Infrastructure Mapping Backend API

## Overview

This is a Node.js backend API for the OptiH2 green hydrogen infrastructure mapping and optimization platform. The backend provides real-time data fetching, analysis, and recommendation services for hydrogen project site selection.

## Features

- **Real-time Data Integration**: Fetches data from NASA POWER, OpenWeatherMap, World Bank, and OpenStreetMap APIs
- **Hydrogen Infrastructure Mapping**: Plants, pipelines, and storage facilities
- **Renewable Energy Analysis**: Solar and wind resource assessment
- **Demand Center Analysis**: Population and industrial demand mapping
- **Site Recommendation Engine**: AI-powered optimization for project placement
- **RESTful API**: Comprehensive endpoints with Swagger documentation
- **Real-time Updates**: Socket.IO integration for live data updates
- **Automated Data Refresh**: Cron jobs for scheduled data updates

## Tech Stack

- **Node.js** + **Express.js** - Server framework
- **Axios** - HTTP client for API calls
- **Socket.IO** - Real-time communication
- **node-cron** - Scheduled job execution
- **Swagger** - API documentation
- **Winston** - Logging
- **dotenv** - Environment configuration

## API Endpoints

### Infrastructure
- `GET /api/plants` - Hydrogen production facilities
- `GET /api/pipelines` - Transportation infrastructure
- `GET /api/pipelines/network` - Network analysis

### Renewable Energy
- `GET /api/renewables` - All renewable data
- `GET /api/renewables/solar?lat=X&lon=Y` - Solar irradiance data
- `GET /api/renewables/wind?lat=X&lon=Y` - Wind resource data
- `GET /api/renewables/best` - Top renewable locations

### Demand Centers
- `GET /api/demand` - Population and industrial demand
- `GET /api/demand/nearby?lat=X&lon=Y` - Nearby demand centers
- `GET /api/demand/forecast` - Demand projections

### Recommendations
- `GET /api/recommendations?south=X&west=Y&north=Z&east=W` - Site recommendations
- `GET /api/recommendations/analyze/{lat}/{lon}` - Detailed site analysis
- `POST /api/recommendations/compare` - Compare multiple sites

### Utilities
- `GET /health` - Health check
- `GET /api-docs` - Swagger documentation

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start the server**:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Environment Variables

```env
# API Keys
OPENWEATHER_API_KEY=your_openweathermap_api_key

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Settings
ALLOWED_ORIGINS=http://localhost:3000

# External APIs
NASA_POWER_BASE_URL=https://power.larc.nasa.gov/api/temporal/daily/point
WORLD_BANK_BASE_URL=https://api.worldbank.org/v2
OVERPASS_API_URL=https://overpass-api.de/api/interpreter

# Cron Jobs
DATA_FETCH_INTERVAL=0 */1 * * *
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:5000/api-docs`
- **Health Check**: `http://localhost:5000/health`

## Data Sources

### External APIs
- **NASA POWER API** - Solar irradiance data (no key required)
- **OpenWeatherMap API** - Wind data (API key required)
- **World Bank API** - Population data (no key required)
- **OpenStreetMap Overpass API** - Infrastructure data (no key required)

### Recommendation Algorithm

The site recommendation engine uses a weighted scoring system:

```
Total Score = (Renewable Score × 0.4) + 
              (Demand Score × 0.3) + 
              (Cost Score × 0.2) + 
              (Regulatory Score × 0.1)
```

**Factors considered**:
- **Renewable (40%)**: Solar irradiance, wind speed, resource proximity
- **Demand (30%)**: Population density, industrial areas, transport hubs
- **Cost (20%)**: Infrastructure costs, terrain, accessibility
- **Regulatory (10%)**: Policy support, permitting ease

## Architecture

```
Server/
├── server.js              # Main server entry point
├── config/                # Configuration files
├── routes/                # API route definitions
│   ├── plants.js         # Hydrogen plants endpoints
│   ├── pipelines.js      # Pipeline infrastructure
│   ├── renewables.js     # Renewable energy data
│   ├── demand.js         # Demand centers
│   └── recommendations.js # Site recommendations
├── controllers/           # Business logic
├── services/             # Core services
│   ├── dataFetcher.js   # External API integration
│   ├── dataCleaner.js   # Data normalization
│   ├── recommender.js   # Recommendation algorithm
│   └── logger.js        # Logging service
├── jobs/                 # Scheduled tasks
│   └── cronFetch.js     # Data refresh jobs
└── package.json
```

## Data Flow

1. **Cron Jobs** → Fetch fresh data from external APIs hourly
2. **Data Cleaning** → Normalize and standardize data formats
3. **In-Memory Storage** → Store processed data for fast access
4. **API Endpoints** → Serve data to frontend applications
5. **Real-time Updates** → Push updates via Socket.IO

## Error Handling

- Comprehensive error logging with Winston
- Graceful API fallbacks for external service failures
- Input validation and sanitization
- HTTP status codes and error messages

## Performance Features

- **In-memory caching** for fast data access
- **Request rate limiting** to prevent API abuse
- **Batch processing** for external API calls
- **Optimized data structures** for geospatial queries

## Development

### Adding New Endpoints

1. Create controller in `controllers/`
2. Define routes in `routes/`
3. Add Swagger documentation
4. Update main `server.js` if needed

### Adding New Data Sources

1. Extend `dataFetcher.js` with new API integration
2. Add data cleaning logic in `dataCleaner.js`
3. Update cron jobs in `cronFetch.js`
4. Create corresponding endpoints

## Deployment

### Production Setup

1. Set `NODE_ENV=production`
2. Configure proper logging levels
3. Set up process monitoring (PM2 recommended)
4. Configure reverse proxy (Nginx)
5. Set up SSL certificates

### Docker Support (Future)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Contributing

1. Follow ES6+ JavaScript standards
2. Add comprehensive Swagger documentation
3. Include error handling and logging
4. Write meaningful commit messages
5. Test API endpoints thoroughly

## License

MIT License - See LICENSE file for details

## Support

For questions or issues:
- Check the Swagger documentation at `/api-docs`
- Review the health endpoint at `/health`
- Check server logs for detailed error information

---

**OptiH2 Backend** - Powering the future of green hydrogen infrastructure mapping.
