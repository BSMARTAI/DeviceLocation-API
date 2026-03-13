const express = require("express");
const twilio = require("twilio");

const app = express();

app.use(express.json());

/*
Twilio client
Uses environment variables from Render
*/
const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

/*
ROOT ENDPOINT
This stops the "Cannot GET /" message
*/
app.get("/", (req, res) => {
  res.json({
    service: "B SMART DeviceLocation API",
    status: "running",
    company: "B SMART AI",
    endpoints: [
      "/location-retrieval",
      "/carrier-lookup",
      "/carrier-test"
    ]
  });
});

/*
LOCATION TEST ENDPOINT
Simple test data for now
*/
app.get("/location-retrieval", (req, res) => {
  res.json({
    latitude: 38.627,
    longitude: -90.1994,
    city: "St Louis",
    state: "Missouri",
    country: "USA"
  });
});

/*
POST CARRIER LOOKUP
Used by apps / APIs
*/
app.post("/carrier-lookup", async (req, res) => {

  const phone = req.body.phoneNumber;

  if (!phone) {
    return res.status(400).json({
      error: "phoneNumber is required"
    });
  }

  try {

    const data = await client.lookups.v2.phoneNumbers(phone)
      .fetch({ type: ["carrier"] });

    res.json({
      phone: phone,
      carrier: data.carrier?.name || "Unknown",
      type: data.carrier?.type || "Unknown",
      country: data.countryCode
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

/*
GET TEST VERSION
Lets you test in a browser
*/
app.get("/carrier-test", async (req, res) => {

  const phone = "+13145551234";

  try {

    const data = await client.lookups.v2.phoneNumbers(phone)
      .fetch({ type: ["carrier"] });

    res.json({
      phone: phone,
      carrier: data.carrier?.name || "Unknown",
      type: data.carrier?.type || "Unknown",
      country: data.countryCode
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

/*
SERVER START
Uses Render dynamic port
*/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Telecom API Gateway running on port ${PORT}`);
});
