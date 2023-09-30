import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

// Use express.json() middleware as bodyParser.json() is deprecated
app.use(express.json());

// Use helmet middleware for security
app.use(helmet());

// Define whitelist as a Set for efficient lookups
const whitelist = new Set(["http://localhost:19006"]);

// Simplify the corsOptions object
const corsOptions: cors.CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || whitelist.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Use cors middleware with corsOptions
app.use(cors(corsOptions));

// Register routes
routes(app);

// Global error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error occurred in global handler");
  console.error(err.stack);
  res.status(500).send({
    message: err.message || "Internal Server Error",
  });
});

// Define a simple root route
app.get("/", (req: Request, res: Response) => {
  console.log("SUCCESS");
  res.status(200).send("SUCCESS");
});

// Use the PORT from environment variables or fallback to 4000
const port = process.env.PORT || 4000;

// Start the server and listen for incoming connections
app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
