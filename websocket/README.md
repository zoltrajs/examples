# WebSocket Example

This example demonstrates how to use WebSockets in the Zoltra. WebSockets provide a persistent connection between a client and server, allowing for real-time, bidirectional communication.

## Features

- Real-time bidirectional communication
- Event-based message handling
- Client tracking and management
- Broadcasting messages to all connected clients
- Integration with Zoltra's existing HTTP server

## Running the Example

To run this example, follow these steps:

1. Navigate to the example directory:
   ```bash
   cd examples/websocket
   ```
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
    npm run dev
   ```

4. Open your browser and navigate to `http://localhost:8000/index.html`

5. Open multiple browser windows to see real-time communication in action

## How It Works

This example creates a simple chat application where:

- Users can connect to the WebSocket server
- Messages sent by one user are broadcast to all connected users
- The server tracks connected clients and notifies when users join or leave

## Implementation Details

### Server-side Configuration

To enable WebSockets in your Zoltra application, add the WebSocket options to your application configuration:

```typescript
const app = new Application({
  // ... other options
  websocket: {
    enabled: true, // Enable WebSocket support
    path: "/ws", // WebSocket endpoint path
    perMessageDeflate: true, // Enable compression
  },
});
```

### Event Handlers

Register event handlers for WebSocket events:

```typescript
// Handle connection event
app.ws("connection", (ctx) => {
  console.log(`Client connected: ${ctx.id}`);
});

// Handle message event
app.ws("message", (ctx) => {
  console.log("Received message:", ctx.message);
});

// Handle close event
app.ws("close", (ctx) => {
  console.log(`Client disconnected: ${ctx.id}`);
});

// Handle error event
app.ws("error", (ctx) => {
  console.error("WebSocket error:", ctx.error);
});
```

### Broadcasting Messages

Send messages to all connected clients:

```typescript
app.broadcast({
  type: "announcement",
  message: "Server is restarting in 5 minutes",
});
```

### Client-side Implementation

Connect to the WebSocket server from the browser:

```javascript
const socket = new WebSocket("ws://localhost:8000/ws");

// Connection opened
socket.addEventListener("open", (event) => {
  console.log("Connected to server");
});

// Listen for messages
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  console.log("Received message:", message);
});

// Send a message
socket.send(
  JSON.stringify({
    type: "chat",
    text: "Hello, world!",
  })
);
```

## WebSocket Context

Each WebSocket connection has a context object that provides:

- Access to the WebSocket connection
- Client information (ID, IP, headers)
- Methods for sending messages
- Data storage for the connection

```typescript
app.ws("connection", (ctx) => {
  // Access client information
  console.log(ctx.id); // Unique client ID
  console.log(ctx.ip); // Client IP address
  console.log(ctx.headers); // HTTP headers from the upgrade request

  // Send a message to this client
  ctx.send({ type: "welcome", message: "Hello!" });

  // Store data for this connection
  ctx.set("username", "user123");

  // Later, retrieve the data
  const username = ctx.get("username");
});
```

## Advanced Usage

### Custom Message Handling

Implement custom message handling based on message type:

```typescript
app.ws("message", (ctx) => {
  const message = ctx.message;

  switch (message.type) {
    case "chat":
      // Handle chat message
      app.broadcast({
        type: "chat",
        from: ctx.id,
        text: message.text,
      });
      break;

    case "private":
      // Handle private message
      sendPrivateMessage(message.to, {
        type: "private",
        from: ctx.id,
        text: message.text,
      });
      break;
  }
});
```

### Selective Broadcasting

Broadcast messages to specific clients using a filter function:

```typescript
// Broadcast only to clients in a specific room
app.broadcast(
  { type: "room_message", room: "general", text: "Hello room!" },
  (client) => client.get("room") === "general"
);
```

## Security Considerations

- Always validate and sanitize incoming WebSocket messages
- Implement authentication for WebSocket connections
- Consider rate limiting to prevent abuse
- Be careful with broadcasting sensitive information
