import express from "express";
import path from "path";
import { spawn } from "child_process";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const PYTHON_PORT = 5000;

// Set up body parser with adequate limit for base64 uploads before forwarding
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Start python server backend
console.log("[Node Proxy] Starting Python api server (server.py)...");
const pythonProcess = spawn("python3", ["server.py"], {
  stdio: "inherit",
  env: process.env,
});

console.log(pythonProcess)

pythonProcess.on("error", (err) => {
  console.error("[Node Proxy] CRITICAL: Failed to start Python process:", err);
});

pythonProcess.on("close", (code) => {
  console.log(`[Node Proxy] Python process exited with code ${code}`);
});

// Graceful cleanup
process.on("exit", () => {
  pythonProcess.kill();
});
process.on("SIGINT", () => {
  pythonProcess.kill();
  process.exit();
});
process.on("SIGTERM", () => {
  pythonProcess.kill();
  process.exit();
});

// Proxy handler to relay API calls to python backend using native fetch
app.all("/api/*", async (req, res) => {
  const pythonUrl = `http://127.0.0.1:${PYTHON_PORT}${req.originalUrl || req.url}`;
  
  try {
    const headers: Record<string, string> = {};
    const lowerKeysToSkip = [
      "host",
      "connection",
      "content-length",
      "transfer-encoding",
      "content-encoding",
      "accept-encoding",
      "keep-alive",
      "upgrade"
    ];

    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined && !lowerKeysToSkip.includes(key.toLowerCase())) {
        headers[key] = Array.isArray(value) ? value.join(", ") : String(value);
      }
    }
    
    // Bind to the local Python receiver port
    headers["host"] = `127.0.0.1:${PYTHON_PORT}`;

    const fetchOptions: RequestInit = {
      method: req.method,
      headers: headers,
    };

    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(pythonUrl, fetchOptions);
    const data = await response.text();

    res.status(response.status);
    
    // Copy headers back to client response
    response.headers.forEach((value, key) => {
      if (key !== "content-encoding" && key !== "transfer-encoding") {
        res.setHeader(key, value);
      }
    });

    res.send(data);
  } catch (error: any) {
    console.error(`[Node Proxy] Error forwarding request to Python:`, error);
    res.status(502).json({ error: "Failed to communicate with Python backend service." });
  }
});

// Setup Vite development server or direct static serving for production
async function configureServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Node Proxy] Server running and listening on http://0.0.0.0:${PORT}`);
  });
}

configureServer();
