import "dotenv/config";
import app from "./app.js";
import { loadData } from "./utils/csv.js";

// Load the CSV data before handling any requests
loadData();

// Local development: start the server with app.listen
// Vercel: the default export is used as the serverless handler
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Vercel serverless handler export
export default app;
