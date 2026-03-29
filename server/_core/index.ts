import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // SEO: XML Sitemap
  app.get("/sitemap.xml", (_req, res) => {
    const BASE = "https://loomelicmedia.com";
    const now = new Date().toISOString().split("T")[0];
    const urls = [
      // Core pages
      { loc: "/", priority: "1.0", changefreq: "weekly" },
      { loc: "/about", priority: "0.8", changefreq: "monthly" },
      { loc: "/contact", priority: "0.8", changefreq: "monthly" },
      { loc: "/portfolio", priority: "0.9", changefreq: "weekly" },
      { loc: "/use-cases", priority: "0.9", changefreq: "weekly" },
      { loc: "/process", priority: "0.7", changefreq: "monthly" },
      { loc: "/projects", priority: "0.8", changefreq: "weekly" },
      { loc: "/services", priority: "0.8", changefreq: "monthly" },
      // Services
      { loc: "/services/dealer-services", priority: "0.9", changefreq: "monthly" },
      { loc: "/services/dealer-services/dealerships", priority: "0.9", changefreq: "monthly" },
      { loc: "/services/dealer-services/inventory-photography", priority: "0.8", changefreq: "monthly" },
      { loc: "/services/dealer-services/walkaround-videos", priority: "0.8", changefreq: "monthly" },
      { loc: "/services/dealer-services/short-form-reels", priority: "0.8", changefreq: "monthly" },
      { loc: "/services/dealer-services/headshots", priority: "0.7", changefreq: "monthly" },
      { loc: "/services/events", priority: "0.9", changefreq: "monthly" },
      { loc: "/services/headshots", priority: "0.7", changefreq: "monthly" },
      { loc: "/services/websites", priority: "0.7", changefreq: "monthly" },
      { loc: "/services/automotive-marketing", priority: "0.8", changefreq: "monthly" },
      { loc: "/services/event-coverage", priority: "0.9", changefreq: "monthly" },
      { loc: "/services/social-media-content", priority: "0.8", changefreq: "monthly" },
      // Projects
      { loc: "/projects/lexus-of-henderson", priority: "0.8", changefreq: "monthly" },
      { loc: "/projects/lexus-of-las-vegas", priority: "0.8", changefreq: "monthly" },
      { loc: "/projects/centennial-subaru", priority: "0.8", changefreq: "monthly" },
      { loc: "/projects/las-vegas-raiders-tour", priority: "0.8", changefreq: "monthly" },
      { loc: "/projects/wondr-nation-g2e", priority: "0.8", changefreq: "monthly" },
      { loc: "/projects/bob-marley-hope-road", priority: "0.8", changefreq: "monthly" },
      { loc: "/projects/sports-illustrated-sportsperson-2026", priority: "0.8", changefreq: "monthly" },
      { loc: "/projects/jw-offroad", priority: "0.7", changefreq: "monthly" },
    ];
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls.map(u =>
        `  <url>\n    <loc>${BASE}${u.loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
      ),
      '</urlset>',
    ].join("\n");
    res.setHeader("Content-Type", "application/xml");
    res.send(xml);
  });

  // SEO: robots.txt
  app.get("/robots.txt", (_req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.send([
      "User-agent: *",
      "Allow: /",
      "Disallow: /admin",
      "Disallow: /dealer/admin",
      "Disallow: /vendor/admin",
      "Disallow: /growth",
      "Disallow: /crm",
      "Disallow: /api",
      "",
      "Sitemap: https://loomelicmedia.com/sitemap.xml",
    ].join("\n"));
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
