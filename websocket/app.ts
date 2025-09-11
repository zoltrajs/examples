import { Application, Static } from "zoltra";

// Create a new application instance
const app = new Application({
  logLevel: "debug",
  // Enable WebSockets
  websocket: {
    enabled: true,
    path: "/ws",
    // Enable per-message deflate compression
    perMessageDeflate: true,
  },
});

app.use(new Static("./public"));

// Track connected clients
const clients = new Map();

// Handle WebSocket connection event
app.ws("connection", (ctx) => {
  // Store client in our map
  clients.set(ctx.id, {
    id: ctx.id,
    ip: ctx.ip,
    userAgent: ctx.headers["user-agent"],
    connectedAt: new Date(),
  });

  app.logger.info(`Client connected: ${ctx.id}`, {
    id: ctx.id,
    ip: ctx.ip,
    total: clients.size,
  });

  // Send welcome message to the client
  ctx.send({
    type: "welcome",
    message: `Welcome! You are client #${clients.size}`,
    id: ctx.id,
  });

  // Broadcast new connection to all clients
  app.broadcast({
    type: "user_joined",
    id: ctx.id,
    timestamp: new Date(),
    count: clients.size,
  });
});

// Handle WebSocket message event
app.ws("message", (ctx) => {
  const message = ctx.message;

  app.logger.debug(`Received message from ${ctx.id}:`, message);

  // Handle different message types
  if (message.type === "chat") {
    // Broadcast chat message to all clients
    app.broadcast({
      type: "chat",
      from: ctx.id,
      text: message.text,
      timestamp: new Date(),
    });
  } else if (message.type === "ping") {
    // Respond with pong directly to the client
    ctx.send({
      type: "pong",
      timestamp: new Date(),
    });
  }
});

// Handle WebSocket close event
app.ws("close", (ctx) => {
  // Remove client from our map
  clients.delete(ctx.id);

  app.logger.info(`Client disconnected: ${ctx.id}`, {
    id: ctx.id,
    remaining: clients.size,
  });

  // Broadcast disconnection to all clients
  app.broadcast({
    type: "user_left",
    id: ctx.id,
    timestamp: new Date(),
    count: clients.size,
  });
});

// Handle WebSocket error event
app.ws("error", (ctx) => {
  app.logger.error(`WebSocket error for client ${ctx.id}:`, {
    error: ctx.error?.message,
    stack: ctx.error?.stack,
  });
});

// Create an endpoint to get connected clients
app.get("/api/clients", (ctx) => {
  ctx.json({
    clients: Array.from(clients.values()),
    count: clients.size,
  });
});

// Start the server
app.listen(app.env.get("PORT", 8000)).then(() => {
  app.logger.info("WebSocket example running");
  app.logger.info(
    `Open http://localhost:${app.env.get("PORT", 8000)} in your browser`
  );
});
