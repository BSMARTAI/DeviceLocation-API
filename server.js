const express = require("express");
const twilio = require("twilio");

const app = express();

app.use(express.json());

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

// Root API status
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
});

// Test location endpoint
app.get("/location-retrieval", (req, res) => {
  res.json({
    latitude: 38.627,
    longitude: -90.1994,
    city: "St Louis"
  });
});

// Carrier lookup using Twilio
app.post("/carrier-lookup", async (req, res) => {
  const phone = req.body.phoneNumber;

  try {
    const data = await client.lookups.v2.phoneNumbers(phone)
      .fetch({ type: ["carrier"] });

    res.json({
      phone: phone,
      carrier: data.carrier.name,
      type: data.carrier.type,
      country: data.countryCode
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Telecom API Gateway running on port 3000");
});
