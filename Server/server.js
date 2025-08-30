import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Import routes
import plantsRoutes from './routes/plants.js';
import pipelinesRoutes from './routes/pipelines.js';
import renewablesRoutes from './routes/renewables.js';
import demandRoutes from './routes/demand.js';
import recommendationsRoutes from './routes/recommendations.js';

// Import jobs
import './jobs/cronFetch.js';

// Import services
import { logger } from './services/logger.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server for Socket.IO
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ["http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OptiH2 - Green Hydrogen Infrastructure API',
      version: '1.0.0',
      description: 'REST API for Green Hydrogen Infrastructure Mapping and Optimization',
      contact: {
        name: 'OptiH2 Team',
        email: 'support@optih2.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Plant: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            capacity: { type: 'number' },
            status: { type: 'string', enum: ['operational', 'planned', 'under_construction'] },
            type: { type: 'string', enum: ['production', 'storage', 'distribution'] },
            lastUpdated: { type: 'string', format: 'date-time' }
          }
        },
        Pipeline: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            coordinates: {
              type: 'array',
              items: {
                type: 'array',
                items: { type: 'number' }
              }
            },
            capacity: { type: 'number' },
            length: { type: 'number' },
            status: { type: 'string' },
            lastUpdated: { type: 'string', format: 'date-time' }
          }
        },
        RenewableData: {
          type: 'object',
          properties: {
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            solarIrradiance: { type: 'number' },
            windSpeed: { type: 'number' },
            windDirection: { type: 'number' },
            temperature: { type: 'number' },
            lastUpdated: { type: 'string', format: 'date-time' }
          }
        },
        DemandCenter: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            population: { type: 'number' },
            industrialDemand: { type: 'number' },
            transportDemand: { type: 'number' },
            lastUpdated: { type: 'string', format: 'date-time' }
          }
        },
        Recommendation: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            score: { type: 'number' },
            factors: {
              type: 'object',
              properties: {
                renewableScore: { type: 'number' },
                demandScore: { type: 'number' },
                costScore: { type: 'number' },
                regulatoryScore: { type: 'number' }
              }
            },
            recommendedCapacity: { type: 'number' },
            estimatedCost: { type: 'number' },
            lastUpdated: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'OptiH2 API Documentation',
  customCss: '.swagger-ui .topbar { display: none }'
}));

// API Routes
app.use('/api/plants', plantsRoutes);
app.use('/api/pipelines', pipelinesRoutes);
app.use('/api/renewables', renewablesRoutes);
app.use('/api/demand', demandRoutes);
app.use('/api/recommendations', recommendationsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to OptiH2 - Green Hydrogen Infrastructure API',
    version: '1.0.0',
    documentation: `/api-docs`,
    endpoints: {
      plants: '/api/plants',
      pipelines: '/api/pipelines',
      renewables: '/api/renewables',
      demand: '/api/demand',
      recommendations: '/api/recommendations'
    }
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('subscribe-updates', (room) => {
    socket.join(room);
    logger.info(`Client ${socket.id} subscribed to ${room}`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Make io available globally for other modules
global.io = io;

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack, url: req.url, method: req.method });
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Endpoint not found',
      path: req.originalUrl
    }
  });
});

// Start server
httpServer.listen(PORT, () => {
  logger.info(`🚀 OptiH2 Server running on port ${PORT}`);
  logger.info(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
  logger.info(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

export default app;
