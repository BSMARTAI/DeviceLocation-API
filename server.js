const express = require("express");
const twilio = require("twilio");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

/* ROOT ROUTE */
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

/* LOCATION ENDPOINT */
app.get("/location-retrieval", (req, res) => {
  res.json({
    latitude: 38.627,
    longitude: -90.1994,
    city: "St Louis",
    state: "Missouri",
    country: "USA"
  });
});

/* CARRIER LOOKUP */
app.post("/carrier-lookup", async (req, res) => {

  const phone = req.body.phoneNumber;

  /* VALIDATION */
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

/* TEST ROUTE */
app.get("/carrier-test", async (req, res) => {

  const phone = "+18082894652";

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

/* SERVER */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`B SMART Telecom API running on port ${PORT}`);
});
