# OptiH2 - Green Hydrogen Infrastructure Mapping

A comprehensive web application for visualizing and optimizing India's hydrogen infrastructure network.

## Features

- **Interactive Map**: Visualize hydrogen infrastructure across India
- **Real-time Data**: Integration with external APIs (NASA, World Bank, OpenStreetMap)
- **Optimization Tools**: AI-powered network optimization
- **Geographical Display**: Interactive map with layers for plants, pipelines, renewables, and demand centers
- **State Filtering**: Filter data by Indian states
- **Real Data Integration**: Seamless connection between optimize and map pages

## Quick Start

### Option 1: Frontend Only (Recommended for development)
```bash
cd client
npm install
npm run dev
```
This will start the frontend with demo data. The application will work without the backend server.

### Option 2: Full Stack (Frontend + Backend)
```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../Server
npm install

# Start both servers
cd ../client
npm run dev:full
```

### Option 3: Manual Start
```bash
# Terminal 1 - Start frontend
cd client
npm run dev

# Terminal 2 - Start backend
cd Server
npm run dev
```

## API Integration

The application uses a shared API endpoint (`/api/real-data`) that both the optimize page and map page utilize:

- **Optimize Page**: Uses real data for optimization calculations
- **Map Page**: Displays the same data geographically
- **Fallback System**: Gracefully handles backend server unavailability

## Data Sources

- **Real Data**: External APIs (NASA POWER, World Bank, OpenStreetMap)
- **Demo Data**: Built-in sample data for development
- **Backend API**: Node.js server with additional infrastructure data

## Map Features

- **Layers**: Plants, Pipelines, Demand Centers, Renewables
- **Interactive Markers**: Click for detailed information
- **State Filtering**: Filter by Indian states
- **Real-time Status**: Shows when real vs demo data is being used

## Development

### Frontend (Next.js)
- Location: `client/`
- Port: 3000
- Framework: Next.js 15 with TypeScript

### Backend (Node.js)
- Location: `Server/`
- Port: 5000
- Framework: Express.js with Socket.IO

### Key Files
- `client/hooks/useMapData.ts` - Map data management
- `client/app/api/real-data/route.ts` - Shared API endpoint
- `client/app/map/page.tsx` - Map page
- `client/app/optimize/page.tsx` - Optimization page

## Troubleshooting

### Backend Server Not Available
The application will automatically fall back to demo data if the backend server is not running. No action required.

### API Errors
Check the browser console for detailed error messages. The application includes comprehensive error handling.

### Map Not Loading
Ensure you have an internet connection for the map tiles. The application uses OpenStreetMap tiles.

## Environment Variables

Create a `.env.local` file in the `client/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## License

MIT License
