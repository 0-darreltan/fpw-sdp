// index.js
require("dotenv").config();
const app = require("./app"); // pastikan nama file utama kamu adalah app.js
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
