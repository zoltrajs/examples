# Zoltra Starter (Next)

A simple TypeScript web application built with the [Zoltra](https://github.com/zoltrajs/zoltra/tree/next). This starter project provides a basic API server with CORS enabled and demonstrates fundamental routing patterns.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)

## Getting Started

1. Start the development server:

   ```bash
   npm run dev
   ```

2. The server will start on port 5000 (configurable via `.env` file)
3. Open your browser and visit `http://localhost:5000`

## Available Scripts

- [`npm run dev`](package.json:7) - Start development server with hot reload
- [`npm run start`](package.json:8) - Start production server
- [`npm run gen-secret`](package.json:9) - Generate a secret key

## API Endpoints

### GET /

Returns a welcome message from the root route.

**Response:**

```json
{
  "message": "Welcome to zoltra"
}
```

**Example:**

```bash
curl http://localhost:5000/
```

### GET /hello

Returns a simple hello world message.

**Response:**

```json
{
  "message": "hello world"
}
```

**Example:**

```bash
curl http://localhost:5000/hello
```

## Project Structure

- [`app.ts`](app.ts:1) - Main application entry point with route definitions
- [`routes/index.ts`](routes/index.ts:1) - Default route handler for the root path
- [`package.json`](package.json:1) - Project dependencies and scripts

## Usage with JavaScript/Fetch

```javascript
// Get welcome message
fetch("http://localhost:5000/")
  .then((response) => response.json())
  .then((data) => console.log(data));

// Get hello world message
fetch("http://localhost:5000/hello")
  .then((response) => response.json())
  .then((data) => console.log(data));
```

## Development

The application includes:

- ✅ CORS support enabled via [`app.enableCors()`](app.ts:5)
- ✅ TypeScript configuration with [`tsconfig.json`](tsconfig.json:1)
- ✅ Environment-based port configuration via [`app.env.get("PORT")`](app.ts:11)
- ✅ JSON response helpers via [`context.json()`](app.ts:8)

Start building your API by adding more routes to [`app.ts`](app.ts:1) or creating additional route handlers in the `routes/` directory or static route.
