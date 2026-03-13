const express = require("express");
const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    service: "B SMART DeviceLocation API",
    status: "running",
    endpoints: [
      "/location-retrieval",
      "/location-verification",
      "/carrier-lookup"
    ]
  });
});listen(3000, () => {
    console.log("Telecom API Gateway running on port 3000")
})
