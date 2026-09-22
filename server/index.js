// Local development entry point (Vercel uses api/index.js instead).
const app = require("./app");

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
