# AI-Based Fitness Tracker

A microservices-based fitness tracking application with AI-powered recommendations using Google's
Gemini API. Track your activities and receive personalized fitness insights!

## 📑 Table of Contents

- [Architecture Overview](#️-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Setup Instructions](#️-setup-instructions)
    - [Clone the Repository](#1-clone-the-repository)
    - [Set Up Databases](#2-set-up-databases)
    - [Set Up RabbitMQ](#3-set-up-rabbitmq)
    - [Set Up Keycloak](#4-set-up-keycloak)
    - [Configure Gemini API](#5-configure-gemini-api)
    - [Start Backend Services](#6-start-backend-services)
    - [Start Frontend](#7-start-frontend)
- [Frontend Setup and Usage](#-frontend-setup-and-usage)
- [Service URLs](#-service-urls)
- [Project Structure](#-project-structure)
- [Authentication Flow](#-authentication-flow)
- [Testing the Application](#-testing-the-application)
- [Troubleshooting](#-troubleshooting)
- [Monitoring and Health Checks](#-monitoring-and-health-checks)
- [Quick Start with Docker Compose](#-quick-start-with-docker-compose-alternative-setup)
- [API Documentation](#-api-documentation)
    - [User Service Endpoints](#user-service-endpoints)
    - [Activity Service Endpoints](#activity-service-endpoints)
    - [Recommendation Service Endpoints](#recommendation-service-endpoints)
- [Architecture Decision Records](#️-architecture-decision-records-adrs)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)
- [Additional Resources](#-additional-resources)

## 🏗️ Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│   API Gateway   │────▶│ Service Registry│
│   (Vite + MUI)  │     │  (Spring Cloud) │     │ (Eureka Server) │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
              ┌─────▼─────┐ ┌───▼─────┐ ┌───▼──────┐
              │   User    │ │Activity │ │    AI    │
              │  Service  │ │ Service │ │ Service  │
              │           │ │         │ │          │
              └─────┬─────┘ └────┬────┘ └────┬─────┘
                    │            │            │
              ┌─────▼─────┐ ┌───▼─────┐ ┌───▼──────┐
              │PostgreSQL │ │ MongoDB │ │ MongoDB  │
              │           │ │         │ │          │
              └───────────┘ └─────────┘ └──────────┘
                                 │            │
                                 └────┬───────┘
                                      │
                                ┌─────▼─────┐
                                │ RabbitMQ  │
                                │           │
                                └───────────┘
```

## 🚀 Tech Stack

### Backend

- **Java 21** with Spring Boot 3.5.4
- **Spring Cloud 2025.0.0** (Latest version)
    - Netflix Eureka - Service Discovery
    - Spring Cloud Gateway - API Gateway
    - Spring Cloud Config - Centralized Configuration
- **PostgreSQL** - User data storage
- **MongoDB** - Activity and recommendation storage
- **RabbitMQ** - Message broker for async communication
- **Keycloak** - OAuth2/OIDC Authentication
- **Google Gemini API** - AI-powered recommendations

### Frontend

- **React 19** with Vite
- **Material-UI v7** - UI components
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **React OAuth2 PKCE** - OAuth2 authentication flow

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Java 21 JDK
- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 15+
- MongoDB 6+
- Git

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-fitness-tracker.git
cd ai-fitness-tracker
```

### 2. Set Up Databases

#### PostgreSQL Setup

Create a database for the User Service:

```sql
CREATE
DATABASE fitness_user_db;
```

Update the username and password in `configserver/src/main/resources/config/user-service.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/fitness_user_db
    username: your_username
    password: your_password
```

#### MongoDB Setup

MongoDB will automatically create databases when services connect. The following databases will be
created:

- `fitnessactivity` - For Activity Service
- `fitnessrecommendations` - For AI Service

### 3. Set Up RabbitMQ

Run RabbitMQ using Docker:

```bash
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management
```

Access RabbitMQ Management UI at http://localhost:15672 (guest/guest)

### 4. Set Up Keycloak

Run Keycloak using Docker:

```bash
docker run -d --name keycloak \
  -p 8181:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest \
  start-dev
```

#### Configure Keycloak:

1. Access Keycloak at http://localhost:8181
2. Login with admin/admin
3. Create a new realm named `fitness-oauth2`
4. Create a client:
    - Client ID: `oauth2-pkce-client`
    - Client Protocol: `openid-connect`
    - Access Type: `public`
    - Valid Redirect URIs: `http://localhost:5173/*`
    - Web Origins: `http://localhost:5173`

### 5. Configure Gemini API

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Set environment variables:

```bash
export GEMINI_API_KEY="your-api-key-here"
export GEMINI_API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
```

Or add them to your IDE run configuration.

### 6. Start Backend Services

Import all services as Maven projects in IntelliJ IDEA and start them in this order:

#### Option A: Using IntelliJ IDEA

1. File → Open → Select the root directory
2. Import as Maven project
3. Run each service using the Spring Boot run configuration

#### Option B: Using Terminal

1. **Eureka Server** (Port: 8761)
   ```bash
   cd eurekaserver
   ./mvnw spring-boot:run
   ```
   Verify at: http://localhost:8761

2. **Config Server** (Port: 8888)
   ```bash
   cd configserver
   ./mvnw spring-boot:run
   ```
   Verify config: http://localhost:8888/user-service/default

3. **API Gateway** (Port: 8080)
   ```bash
   cd gateway
   ./mvnw spring-boot:run
   ```

4. **User Service** (Port: 8081)
   ```bash
   cd userservice
   ./mvnw spring-boot:run
   ```

5. **Activity Service** (Port: 8082)
   ```bash
   cd activityservice
   ./mvnw spring-boot:run
   ```

6. **AI Service** (Port: 8083)
   ```bash
   cd aiservice
   # Remember to set environment variables first!
   export GEMINI_API_KEY="your-api-key"
   export GEMINI_API_URL="https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
   ./mvnw spring-boot:run
   ```

**Note**: Wait for each service to fully start before starting the next one. Check Eureka dashboard
to ensure all services are registered.

### 7. Start Frontend

```bash
cd fitness-frontend
npm install
npm run dev
```

The application will be available at http://localhost:5173

## 🎨 Frontend Setup and Usage

### Prerequisites

- Node.js 18+ and npm
- Backend services running (especially API Gateway on port 8080)
- Keycloak configured and running

### Installation and Configuration

1. **Install Dependencies**
   ```bash
   cd fitness-frontend
   npm install
   ```

2. **Configure API URL** (Currently Hardcoded)

   ⚠️ **Important**: The API URL is currently hardcoded in `src/services/api.js`:
   ```javascript
   const API_URL = 'http://localhost:8080/api';
   ```

   For production or different environments, you'll need to modify this directly in the file.

3. **Configure Keycloak**

   The OAuth2 configuration is in `src/authConfig.js`:
   ```javascript
   export const authConfig = {
     clientId: 'oauth2-pkce-client',
     authorizationEndpoint: 'http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/auth',
     tokenEndpoint: 'http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/token',
     redirectUri: 'http://localhost:5173',
     scope: 'openid profile email offline_access',
   }
   ```

   Update these URLs if your Keycloak is running on different ports.

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open http://localhost:5173 in your browser

### Production Build

```bash
npm run build
npm run preview  # To test production build locally
```

The build output will be in the `dist/` directory.

### Features Available

1. **Authentication**
    - OAuth2 PKCE flow with Keycloak
    - Automatic token refresh
    - Logout functionality

2. **Activity Management**
    - ✅ Create new activities (Running, Walking, Cycling)
    - ✅ View all activities in a grid layout
    - ✅ Click on activities for detailed view
    - ✅ Real-time form validation
    - ✅ Loading states and error handling

3. **AI Recommendations**
    - ✅ View AI-generated insights for each activity
    - ✅ Personalized improvements and suggestions
    - ✅ Safety guidelines
    - ✅ Powered by Google Gemini

4. **UI Features**
    - ✅ Responsive design (mobile, tablet, desktop)
    - ✅ Material-UI v7 components
    - ✅ Modern gradient styling
    - ✅ Activity type icons
    - ✅ Date formatting (Today, Yesterday, etc.)
    - ✅ Hover effects and animations

### Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Known Limitations

1. **Page Refresh on Activity Creation**: Currently, the page refreshes after adding an activity
   instead of updating the list dynamically
2. **No Activity Editing**: Activities cannot be edited after creation
3. **No Activity Deletion**: Activities cannot be deleted
4. **No User Profile Page**: User management features not implemented
5. **No Activity Filters**: Cannot filter by date or activity type
6. **Limited Activity Metrics**: Only duration and calories are tracked

### Development Tips

1. **Redux DevTools**: Install the browser extension to debug state changes
2. **Network Tab**: Monitor API calls to ensure proper authentication
3. **Console Errors**: Check for any Keycloak or CORS-related errors

### Folder Structure

```
fitness-frontend/
├── src/
│   ├── components/
│   │   ├── ActivityDetail.jsx
│   │   ├── ActivityForm.jsx
│   │   └── ActivityList.jsx
│   ├── services/
│   │   └── api.js           # API configuration (hardcoded URL here)
│   ├── store/
│   │   ├── authSlice.js     # Redux auth state
│   │   └── store.js         # Redux store configuration
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # App entry point
│   └── authConfig.js        # OAuth2 configuration
├── public/
├── index.html
└── package.json
```

### Troubleshooting Frontend Issues

1. **Login Redirect Loop**
    - Check Keycloak redirect URI configuration
    - Ensure it exactly matches: `http://localhost:5173/*`

2. **API Connection Refused**
    - Verify API Gateway is running on port 8080
    - Check browser console for CORS errors
    - Ensure authentication token is being sent

3. **Blank Page After Login**
    - Check if Redux store has the user data
    - Verify token is stored in localStorage
    - Look for JavaScript errors in console

4. **Style/CSS Issues**
    - Clear browser cache
    - Ensure Material-UI is properly installed
    - Check for CSS conflicts in App.css

## 🔧 Service URLs

| Service             | URL                    |
|---------------------|------------------------|
| Frontend            | http://localhost:5173  |
| API Gateway         | http://localhost:8080  |
| Eureka Dashboard    | http://localhost:8761  |
| Config Server       | http://localhost:8888  |
| RabbitMQ Management | http://localhost:15672 |
| Keycloak Admin      | http://localhost:8181  |

## 📁 Project Structure

```
.
├── eurekaserver/          # Service Discovery Server
├── configserver/          # Centralized Configuration
│   └── src/main/resources/config/
│       ├── user-service.yml
│       ├── activity-service.yml
│       ├── ai-service.yml
│       └── api-gateway.yml
├── gateway/               # API Gateway with OAuth2
├── userservice/           # User Management Service
├── activityservice/       # Activity Tracking Service
├── aiservice/             # AI Recommendations Service
└── fitness-frontend/      # React Frontend Application
```

## 🔐 Authentication Flow

1. User clicks login on the frontend
2. Redirected to Keycloak for authentication
3. After successful login, redirected back with authorization code
4. Frontend exchanges code for tokens using PKCE flow
5. Token stored in Redux store and localStorage
6. All API requests include the token in Authorization header
7. Gateway validates token with Keycloak before routing requests

## 🧪 Testing the Application

1. **Register/Login**: Click "Login to Get Started" and authenticate via Keycloak
2. **Add Activity**: Fill in the activity form with type, duration, and calories
3. **View Activities**: See all your logged activities in a grid layout
4. **Get AI Recommendations**: Click on any activity to view AI-powered insights

## 🐛 Troubleshooting

### Common Issues

1. **Services not registering with Eureka**
    - Ensure Eureka Server is running first
    - Check if services are using correct Eureka URL
    - Wait 30 seconds for registration to complete

2. **Database connection errors**
    - Verify PostgreSQL and MongoDB are running
    - Check credentials in config files
    - For PostgreSQL: `psql -U your_username -d fitness_user_db`
    - For MongoDB: `mongosh` to verify connection

3. **Config Server not loading configurations**
    - Ensure config files are in `configserver/src/main/resources/config/`
    - File names must match service names (e.g., `user-service.yml`)
    - Check logs for: `Serving from native locations`

4. **Keycloak authentication fails**
    - Ensure realm name is exactly `fitness-oauth2`
    - Client ID must be `oauth2-pkce-client`
    - Verify redirect URIs match your frontend URL
    - Check CORS settings in Keycloak

5. **RabbitMQ connection refused**
    - Check if RabbitMQ container is running: `docker ps`
    - Verify credentials (default: guest/guest)
    - Ensure ports 5672 and 15672 are not in use

6. **Gemini API errors**
    - Verify API key is set as environment variable
    - Check API quota limits (free tier: 60 requests/minute)
    - Ensure API URL is correct for your region

7. **Frontend can't connect to backend**
    - Check if Gateway is running on port 8080
    - Verify CORS configuration in Gateway
    - Check browser console for specific errors

## 🔍 Monitoring and Health Checks

### Service Health Endpoints

- Eureka Server: http://localhost:8761/actuator/health
- Config Server: http://localhost:8888/actuator/health
- Gateway: http://localhost:8080/actuator/health
- User Service: http://localhost:8081/actuator/health
- Activity Service: http://localhost:8082/actuator/health
- AI Service: http://localhost:8083/actuator/health

### Useful Commands

```bash
# Check if all services are registered in Eureka
curl http://localhost:8761/eureka/apps

# Test Config Server
curl http://localhost:8888/user-service/default

# Check RabbitMQ queues
docker exec -it rabbitmq rabbitmqctl list_queues

# View service logs
docker logs rabbitmq
docker logs keycloak
```

## 🚀 Quick Start with Docker Compose (Alternative Setup)

For easier setup, you can use Docker Compose for infrastructure:

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: fitness_user_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"

  keycloak:
    image: quay.io/keycloak/keycloak:latest
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    ports:
      - "8181:8080"
    command: start-dev

volumes:
  postgres_data:
  mongo_data:
```

Run with: `docker-compose up -d`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Deepanshu Kumar

---

**Note**: This is a personal project for learning microservices architecture. Feel free to use it as
a reference for your own projects!

## 📚 Additional Resources

- [Spring Cloud Documentation](https://spring.io/projects/spring-cloud)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Material-UI Documentation](https://mui.com/)
- [React OAuth2 PKCE](https://github.com/soofstad/react-oauth2-pkce)

## 📡 API Documentation

All API endpoints are accessed through the API Gateway at `http://localhost:8080/api`

### Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Service Endpoints

#### 1. Register User

```http
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "keycloakId": "optional-keycloak-id"
}
```

**Response:**

```json
{
  "id": "uuid",
  "keycloakId": "keycloak-uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-01T10:00:00"
}
```

**Validation:**

- Email: Required, must be valid email format
- Password: Required, minimum 6 characters

#### 2. Get User Profile

```http
GET /api/users/{userId}
```

**Response:**

```json
{
  "id": "uuid",
  "keycloakId": "keycloak-uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-01T10:00:00"
}
```

#### 3. Validate User

```http
GET /api/users/{userId}/validate
```

**Response:**

```json
true
```

### Activity Service Endpoints

#### 1. Track Activity

```http
POST /api/activities
Content-Type: application/json
X-User-ID: user-uuid

{
  "type": "RUNNING",
  "duration": 30,
  "caloriesBurned": 300,
  "startTime": "2024-01-01T10:00:00",
  "additionalMetrics": {
    "distance": 5.2,
    "avgHeartRate": 145
  }
}
```

**Response:**

```json
{
  "id": "activity-uuid",
  "userId": "user-uuid",
  "type": "RUNNING",
  "duration": 30,
  "caloriesBurned": 300,
  "startTime": "2024-01-01T10:00:00",
  "additionalMetric": {
    "distance": 5.2,
    "avgHeartRate": 145
  },
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-01T10:00:00"
}
```

**Activity Types:**

- `RUNNING`
- `WALKING`
- `CYCLING`

#### 2. Get User Activities

```http
GET /api/activities
X-User-ID: user-uuid
```

**Response:**

```json
[
  {
    "id": "activity-uuid",
    "userId": "user-uuid",
    "type": "RUNNING",
    "duration": 30,
    "caloriesBurned": 300,
    "startTime": "2024-01-01T10:00:00",
    "additionalMetric": {},
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
]
```

#### 3. Get Activity by ID

```http
GET /api/activities/{activityId}
```

**Response:** Same as single activity response above

### Recommendation Service Endpoints

#### 1. Get User Recommendations

```http
GET /api/recommendations/user/{userId}
```

**Response:**

```json
[
  {
    "id": "rec-uuid",
    "activityId": "activity-uuid",
    "userId": "user-uuid",
    "activityType": "RUNNING",
    "recommendation": "Great job on your 30-minute run! You maintained a steady pace...",
    "improvements": [
      "Try incorporating interval training",
      "Focus on proper breathing technique"
    ],
    "suggestions": [
      "Increase duration by 5 minutes next week",
      "Add hill training once a week"
    ],
    "safety": [
      "Always warm up before running",
      "Stay hydrated"
    ],
    "createdAt": "2024-01-01T10:30:00"
  }
]
```

#### 2. Get Activity Recommendation

```http
GET /api/recommendations/activity/{activityId}
```

**Response:** Same as single recommendation above

### Error Responses

All endpoints return standard error responses:

#### 400 Bad Request

```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/users/register"
}
```

#### 401 Unauthorized

```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid token",
  "path": "/api/activities"
}
```

#### 404 Not Found

```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Activity not found",
  "path": "/api/activities/invalid-id"
}
```

#### 500 Internal Server Error

```json
{
  "timestamp": "2024-01-01T10:00:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "path": "/api/activities"
}
```

### Rate Limits

- Gemini API: 60 requests per minute (free tier)
- No rate limits on other endpoints

### CORS Configuration

The API Gateway allows requests from:

- `http://localhost:5173` (development)
- Add production URLs as needed

### WebSocket Support

RabbitMQ events are published when activities are created:

- Exchange: `fitness.exchange`
- Queue: `activity.queue`
- Routing Key: `activity.tracking`

## 🏛️ Architecture Decision Records (ADRs)

### Why Microservices?

**Decision**: Implement a microservices architecture instead of a monolithic application.

**Rationale**:

- **Learning Opportunity**: Primary goal was to learn microservices patterns and challenges
- **Independent Scaling**: Services can scale based on their specific load (AI service might need
  more resources)
- **Technology Diversity**: Can use different databases for different services (PostgreSQL for
  users, MongoDB for activities)
- **Fault Isolation**: If AI service fails, users can still track activities
- **Team Scalability**: In a real scenario, different teams could own different services

**Trade-offs**:

- Increased complexity for a fitness app
- Network latency between services
- Distributed transaction challenges

### Why Spring Cloud?

**Decision**: Use Spring Cloud ecosystem for microservices infrastructure.

**Rationale**:

- **Mature Ecosystem**: Well-documented, production-tested components
- **Netflix OSS Integration**: Eureka for service discovery is battle-tested
- **Spring Boot Integration**: Seamless integration with Spring Boot services
- **Config Management**: Centralized configuration with Spring Cloud Config
- **Latest Version**: Using 2025.0.0 ensures compatibility with Spring Boot 3.5.4

### Why PostgreSQL for User Service?

**Decision**: Use PostgreSQL for user data storage.

**Rationale**:

- **ACID Compliance**: User data requires strong consistency
- **Relational Data**: Users have structured relationships (roles, profiles)
- **JPA Support**: Excellent Spring Data JPA integration
- **Authentication**: Works well with Keycloak user federation

### Why MongoDB for Activity & AI Services?

**Decision**: Use MongoDB for activities and recommendations.

**Rationale**:

- **Flexible Schema**: Activities can have varying additional metrics
- **Document Model**: Natural fit for activity records and AI recommendations
- **Time-Series Like**: Activities are essentially time-series data
- **Scalability**: Easy to shard based on user ID or date
- **JSON Native**: AI responses from Gemini are JSON, stored directly

### Why RabbitMQ?

**Decision**: Use RabbitMQ for asynchronous communication.

**Rationale**:

- **Decoupling**: AI service processes activities asynchronously
- **Reliability**: Message persistence ensures no activity is lost
- **Management UI**: Built-in UI for monitoring queues
- **Spring Integration**: Excellent Spring AMQP support
- **Learning**: Good introduction to message-driven architecture

### Why Keycloak?

**Decision**: Use Keycloak for authentication instead of building custom auth.

**Rationale**:

- **Industry Standard**: Learn production-grade OAuth2/OIDC
- **Feature Complete**: User management, MFA, social login ready
- **Security**: Avoid security pitfalls of custom authentication
- **Token Management**: Handles token issuance, refresh, and validation
- **Multi-Realm**: Can separate dev/prod environments

**Trade-offs**:

- Additional infrastructure component
- Learning curve for configuration
- Overhead for simple authentication needs

### Why Google Gemini for AI?

**Decision**: Use Google's Gemini API for fitness recommendations.

**Rationale**:

- **Free Tier**: Generous free tier (60 requests/minute)
- **Quality**: High-quality, contextual responses
- **No Training Needed**: Pre-trained model understands fitness concepts
- **Simple Integration**: REST API is easy to integrate
- **Multi-Modal**: Can extend to analyze workout images/videos later

### Why React with Material-UI?

**Decision**: Use React with MUI for the frontend.

**Rationale**:

- **Component Ecosystem**: MUI provides comprehensive components
- **Modern React**: Using React 19 with latest features
- **Design System**: Consistent design out of the box
- **Customization**: Theme system allows brand customization
- **Responsive**: Mobile-first components
- **Type Safety**: TypeScript support (can be added later)

### Why Redux Toolkit?

**Decision**: Use Redux Toolkit for state management.

**Rationale**:

- **Best Practices**: RTK enforces Redux best practices
- **DevTools**: Excellent debugging experience
- **Auth State**: Clean way to manage authentication state
- **Scalability**: Easy to add more features/slices
- **Async Logic**: Built-in support for async operations

### Why Config Server?

**Decision**: Centralize configuration in Spring Cloud Config Server.

**Rationale**:

- **Environment Management**: Easy dev/staging/prod configuration
- **No Rebuild**: Change config without rebuilding services
- **Encryption**: Supports encrypted values for secrets
- **Version Control**: Config can be versioned in Git
- **Consistency**: All services use same config structure

### Why Not Kubernetes?

**Decision**: Deploy services directly instead of using Kubernetes.

**Rationale**:

- **Learning Curve**: Focus on microservices patterns first
- **Personal Project**: Kubernetes overhead not justified
- **Local Development**: Easier debugging and development
- **Cost**: K8s would increase hosting costs significantly

**Future Consideration**: Could containerize and deploy to K8s once comfortable with current
architecture.

### Database Decisions Summary

| Service          | Database    | Why                           |
|------------------|-------------|-------------------------------|
| User Service     | PostgreSQL  | ACID, relations, JPA          |
| Activity Service | MongoDB     | Flexible schema, time-series  |
| AI Service       | MongoDB     | JSON storage, recommendations |
| Config Server    | File System | Simple, version controlled    |
| Eureka Server    | In-Memory   | Temporary registry data       |