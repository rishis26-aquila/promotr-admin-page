import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import app from "./app.js";
import { loadData } from "./utils/csv.js";

const PORT = process.env.PORT || 3000;

// Initialize Sentry at the very beginning of the app lifecycle
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });
  console.log("✅ Sentry initialized");
}

// Global generic error handler for uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  if (process.env.SENTRY_DSN) Sentry.captureException(err);
  process.exit(1);
});

// Load the CSV Data
loadData();

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 SecureCoder Server running securely on port ${PORT}`);
});
