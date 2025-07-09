# PWP - Fleet Management System

A full-stack web application for managing loads, drivers, and trucks for trucking and logistics operations.

## Project Structure

```
pwp/
├── backend/          # Node.js/Express API server
│   ├── config/       # Database configuration
│   ├── middleware/   # Authentication middleware
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API routes
│   ├── scripts/      # Utility scripts
│   ├── utils/        # Helper functions
│   └── server.js     # Main server file
├── frontend/         # React frontend application
│   ├── public/       # Static assets
│   └── src/          # React source code
│       ├── components/  # Reusable components
│       ├── pages/       # Page components
│       └── services/    # API services
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- OpenRouteService API key

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd pwp
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Configure environment variables
   - In the backend folder, copy `.env.example` to `.env` and update with your values:
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string, JWT secret, and API keys
   ```
   
   - In the frontend folder, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   # Edit .env if your API URL is different from the default
   ```

5. Create an admin user
```bash
cd backend
npm run create-admin
# Follow the prompts to create an admin user
```

### Running the Application

#### Development Mode

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

3. Access the application
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

#### Production Mode

1. Build the frontend
```bash
cd frontend
npm run build
```

2. Start the backend in production mode
```bash
cd backend
npm run start:prod
```

## Security Features

- JWT-based authentication with configurable expiration
- Password hashing with bcrypt
- Secure HTTP headers with Helmet
- Rate limiting to prevent brute force attacks
- CORS protection
- Input validation
- Environment-specific error handling

## Features

- **User Authentication**
  - Secure login with JWT
  - Role-based access control (admin/driver)

- **Load Management**
  - Create, view, update, and delete loads
  - Assign drivers and trucks to loads
  - Track load status (pending, assigned, in-transit, delivered)
  - Automatic distance calculation between pickup and delivery locations

- **Driver Management**
  - Track driver availability and status
  - Assign drivers to trucks and loads
  - Monitor driver location and performance

- **Fleet Management**
  - Track truck status and availability
  - Monitor maintenance schedules
  - Assign trucks to drivers and loads

- **Broker Operations**
  - View load status and information
  - Limited access for external partners

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user information

### Loads
- `GET /api/loads` - Get all loads
- `GET /api/loads/:id` - Get a specific load
- `POST /api/loads` - Create a new load
- `PUT /api/loads/:id` - Update a load
- `PATCH /api/loads/:id/assign` - Assign driver and truck to a load
- `DELETE /api/loads/:id` - Delete a load

### Drivers
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/:id` - Get a specific driver
- `POST /api/drivers` - Create a new driver
- `PUT /api/drivers/:id` - Update a driver
- `DELETE /api/drivers/:id` - Delete a driver

### Trucks
- `GET /api/trucks` - Get all trucks
- `POST /api/trucks` - Create a new truck
- `PUT /api/trucks/:id` - Update a truck
- `DELETE /api/trucks/:id` - Delete a truck

## Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Helmet for security headers
- Express Rate Limit for API protection
- OpenRouteService API for route calculations

**Frontend:**
- React
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling
- Vite for build tooling

## Deployment Considerations

1. **Environment Variables**: Ensure all sensitive information is stored in environment variables
2. **Database Security**: Use strong MongoDB credentials and restrict network access
3. **API Keys**: Secure your OpenRouteService API key and other credentials
4. **HTTPS**: Deploy behind HTTPS in production
5. **Monitoring**: Implement logging and monitoring in production

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request