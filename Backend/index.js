import { server } from "./app.js";

const PORT = process.env.PORT || 5000;

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server running on http://localhost:${PORT}`);
});
