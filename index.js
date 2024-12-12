require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/config/connectDB");
// Start Server
const port = process.env.PORT || 5000;

const main = async () => {
  try {
    await connectDB(); // Connect to the database
    const server = http.createServer(app); // Create the server
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    // Handle server errors
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${port} is already in use.`);
        process.exit(1);
      } else {
        throw error;
      }
    });
  } catch (error) {
    console.error("Error starting the server:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

main();
