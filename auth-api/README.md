# Auth API Example

A TypeScript authentication API built with the [Zoltra framework](https://github.com/zoltrajs/zoltra), demonstrating JWT-based authentication patterns with middleware support.

## Overview

This project showcases a modern authentication API implementation using:

- **Zoltra Framework** - Modern Node.js web framework
- **JWT Authentication** - Secure token-based authentication
- **TypeScript** - Type-safe development experience
- **File-based Routing** - Convention over configuration approach
- **Service Architecture** - Clean separation of concerns

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Installation & Setup

1. **Clone the repository** (or use this example as reference)

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Generate JWT Secret** (Required):

   ```bash
   npm run gen-secret
   ```

   This command generates a secure `JWT_AUTH_SECRET` and adds it to your `.env` file.

4. **Configure Environment Variables:**
   The `.env` file should contain:

   ```env
   PORT=8000
   NODE_ENV=development
   JWT_AUTH_SECRET="your-generated-secret-here"
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

   Or for production:

   ```bash
   npm start
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### Public Endpoints

#### `GET /`

Welcome endpoint

```bash
curl http://localhost:8000/
```

**Response:**

```json
{
  "message": "Welcome to zoltra"
}
```

#### `GET /hello`

Simple hello world endpoint

```bash
curl http://localhost:8000/hello
```

**Response:**

```json
{
  "message": "Hello world"
}
```

#### `POST /auth/login`

Authenticate user and receive JWT token

**Request Body:**

```json
{
  "username": "admin",
  "password": "pass"
}
```

**Example:**

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "pass"}'
```

**Success Response (200):**

```json
{
  "message": "Successfully logged in",
  "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**

```json
{
  "error": "Invalid credentials"
}
```

### Protected Endpoints

#### `GET /user/profile`

Get user profile (requires authentication)

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Example:**

```bash
curl http://localhost:8000/user/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**

```json
{
  "message": "Welcome to your profile",
  "user": "admin"
}
```

**Error Responses:**

- `401` - Missing Authorization header
- `400` - Invalid token format (not Bearer token)
- `403` - Invalid or expired token

## Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant AuthService

    Client->>API: POST /auth/login
    API->>API: Validate credentials
    API->>AuthService: Generate JWT token
    AuthService-->>API: Return signed token
    API-->>Client: Return token

    Client->>API: GET /user/profile (with token)
    API->>AuthService: Verify token
    AuthService->>AuthService: Decode & validate
    AuthService-->>API: Attach user to context
    API-->>Client: Return protected data
```

## Project Structure

```
├── app.ts                 # Main application entry point
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── zoltra.d.ts          # Type definitions for Zoltra extensions
├── .env                 # Environment variables
├── routes/              # File-based routing
│   ├── index.ts         # GET / route handler
│   ├── auth/
│   │   └── login.ts     # POST /auth/login route handler
│   └── user/
│       └── profile.ts   # GET /user/profile route handler
└── services/
    └── auth.ts          # JWT authentication service
```

### Key Components

#### [`app.ts`](app.ts)

- Main application setup
- CORS configuration
- Service registration
- Server initialization

#### [`services/auth.ts`](services/auth.ts)

- **AuthService class** - Handles JWT operations
- **Methods:**
  - `handle()` - Middleware for protecting routes
  - `signToken()` - Generate JWT tokens
  - `verifyToken()` - Validate JWT tokens
  - `decodeToken()` - Decode without verification

#### Route Handlers

- **File-based routing** - Routes are automatically mapped from file structure
- **Middleware support** - Each route can define its own middleware stack
- **Type safety** - Full TypeScript support with context typing

## Environment Variables

| Variable          | Required | Description                 | Example                            |
| ----------------- | -------- | --------------------------- | ---------------------------------- |
| `PORT`            | No       | Server port (default: 5000) | `8000`                             |
| `NODE_ENV`        | No       | Environment mode            | `development`                      |
| `JWT_AUTH_SECRET` | **Yes**  | JWT signing secret          | Generated via `npm run gen-secret` |

## Usage Examples

### Complete Authentication Flow

1. **Login to get token:**

```bash
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "pass"}' \
  | jq -r '.data')
```

2. **Use token to access protected route:**

```bash
curl http://localhost:8000/user/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Testing with Different Tools

**Using HTTPie:**

```bash
# Login
http POST localhost:8000/auth/login username=admin password=pass

# Access protected route
http GET localhost:8000/user/profile Authorization:"Bearer <token>"
```

**Using Postman:**

1. POST to `/auth/login` with JSON body
2. Copy the token from response
3. GET `/user/profile` with `Authorization: Bearer <token>` header

## Development Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start development server with hot reload |
| `npm run start`      | Start production server                  |
| `npm run gen-secret` | Generate JWT secret for .env file        |

## Security Notes

- **JWT Secret**: Always generate a secure secret using `npm run gen-secret`
- **Token Storage**: Store tokens securely on the client side
- **HTTPS**: Use HTTPS in production environments
- **Token Expiration**: Consider implementing token expiration (not shown in this example)

## About Zoltra

This example demonstrates the power and simplicity of the Zoltra framework:

- **File-based routing** - No manual route configuration needed
- **Middleware system** - Clean and composable request handling
- **Service injection** - Built-in dependency injection
- **TypeScript first** - Full type safety out of the box

For more information about Zoltra, visit the [official documentation](https://zoltra.dev).

---

**Note:** This is an example implementation for learning purposes. For production use, consider implementing additional security measures such as:

- Rate limiting
- Input validation and sanitization
- Token expiration and refresh mechanisms
- Proper error handling and logging
- Database integration for user management
