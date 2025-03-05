const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  // sends a hello world in json format
  res.json({ message: "Hello World" });
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
