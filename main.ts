// main.ts
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { setupWebsocketProvider } from "npm:y-websocket@^1.5.0";

// --- Configuration ---
const PORT = 8000;

// Placeholder for a function that will handle API requests
// We will build this out in the next step.
async function handleApiRequest(req: Request): Promise<Response> {
  // Logic for /api/flows, /api/generate-code, etc. will go here
  return new Response("API endpoint not yet implemented.", { status: 501 });
}

// Placeholder for a function that will handle Auth requests
async function handleAuthRequest(req: Request): Promise<Response> {
  // Logic for /auth/google, /auth/google/callback will go here
  return new Response("Auth endpoint not yet implemented.", { status: 501 });
}

// --- Main Server Handler ---
async function mainHandler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;

  console.log(`[${new Date().toLocaleTimeString()}] Request: ${req.method} ${pathname}`);

  // 1. WebSocket Connection for Y.js
  if (pathname.startsWith("/ws/")) {
    // y-websocket handles the upgrade request automatically
    // The second argument is the request object itself
    // We would add persistence logic here later.
    // setupWebsocketProvider(Deno.upgradeWebSocket(req).socket);
    // For now, let's return a simple upgrade response
     if (req.headers.get("upgrade") === "websocket") {
        const { socket, response } = Deno.upgradeWebSocket(req);
        // We will later hook this into the y-websocket provider
        socket.onopen = () => console.log("WebSocket connection established!");
        socket.onmessage = (e) => console.log("Message received:", e.data);
        socket.onclose = () => console.log("WebSocket connection closed.");
        return response;
    }
  }

  // 2. API Routes
  if (pathname.startsWith("/api/")) {
    return await handleApiRequest(req);
  }
  
  // 3. Auth Routes
  if (pathname.startsWith("/auth/")) {
      return await handleAuthRequest(req);
  }

  // 4. Public Flow Execution Route
  if (pathname.startsWith("/f/")) {
      const flowId = pathname.split('/')[2];
      return new Response(`Executing flow: ${flowId}`);
  }

  // 5. Serve Static Frontend Files (HTML, CSS, JS)
  // For simplicity, we'll just serve index.html for now.
  try {
    const filePath = pathname === "/" ? "/index.html" : pathname;
    const file = await Deno.open(`./public${filePath}`);
    return new Response(file.readable);
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}

// --- Start the Server ---
console.log(`🚀 Server starting on http://localhost:${PORT}`);
await serve(mainHandler, { port: PORT });