const express = require("express");
const twilio = require("twilio");

const app = express();
app.use(express.json());

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

const PORT = process.env.PORT || 3000;

/* =====================================
   ROOT STATUS
===================================== */

app.get("/", (req, res) => {
  res.json({
    service: "B SMART Communications + CaptionSign API",
    status: "running",
    company: "B SMART AI",
    endpoints: [
      "/carrier-lookup",
      "/verify-phone",
      "/send-sms",
      "/call-user",
      "/send-otp",
      "/verify-otp",
      "/location-retrieval",
      "/captionsign",
      "/live-caption"
    ]
  });
});

/* =====================================
   LOCATION DEMO
===================================== */

app.get("/location-retrieval", (req, res) => {
  res.json({
    latitude: 38.627,
    longitude: -90.1994,
    city: "St Louis"
  });
});

/* =====================================
   CARRIER LOOKUP
===================================== */

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
      carrier: data.carrier.name,
      type: data.carrier.type,
      country: data.countryCode
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

/* =====================================
   PHONE VERIFICATION
===================================== */

app.post("/verify-phone", async (req, res) => {

  const phone = req.body.phoneNumber;

  if (!phone) {
    return res.status(400).json({
      error: "phoneNumber required"
    });
  }

  try {

    const data = await client.lookups.v2.phoneNumbers(phone).fetch();

    res.json({
      phone: phone,
      valid: true,
      country: data.countryCode
    });

  } catch (err) {

    res.json({
      phone: phone,
      valid: false
    });

  }

});

/* =====================================
   SEND SMS
===================================== */

app.post("/send-sms", async (req, res) => {

  const { phoneNumber, message } = req.body;

  if (!phoneNumber || !message) {
    return res.status(400).json({
      error: "phoneNumber and message required"
    });
  }

  try {

    const msg = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: phoneNumber
    });

    res.json({
      status: "sent",
      sid: msg.sid
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

/* =====================================
   VOICE CALL
===================================== */

app.post("/call-user", async (req, res) => {

  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      error: "phoneNumber required"
    });
  }

  try {

    const call = await client.calls.create({
      url: "http://demo.twilio.com/docs/voice.xml",
      to: phoneNumber,
      from: process.env.TWILIO_PHONE
    });

    res.json({
      status: "calling",
      sid: call.sid
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

/* =====================================
   OTP SYSTEM
===================================== */

const otpStore = {};

/* SEND OTP */

app.post("/send-otp", (req, res) => {

  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      error: "phoneNumber required"
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[phoneNumber] = otp;

  res.json({
    phone: phoneNumber,
    otp: otp,
    message: "OTP generated (demo)"
  });

});

/* VERIFY OTP */

app.post("/verify-otp", (req, res) => {

  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({
      error: "phoneNumber and otp required"
    });
  }

  if (otpStore[phoneNumber] == otp) {

    delete otpStore[phoneNumber];

    res.json({
      verified: true
    });

  } else {

    res.json({
      verified: false
    });

  }

});

/* =====================================
   CAPTIONSIGN API
   (Streaming accessibility infrastructure)
===================================== */

app.post("/captionsign", async (req, res) => {

  const { audio_url } = req.body;

  if (!audio_url) {
    return res.status(400).json({
      error: "audio_url required"
    });
  }

  try {

    /* placeholder AI processing */

    const result = {
      text: "Hello how can I help you",
      captions: true,
      asl_output: "asl_avatar_data",
      timestamp: Date.now()
    };

    res.json(result);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

/* =====================================
   LIVE STREAM CAPTION PROCESSING
===================================== */

app.post("/live-caption", async (req, res) => {

  const { stream } = req.body;

  if (!stream) {
    return res.status(400).json({
      error: "stream required"
    });
  }

  try {

    const caption = {
      text: "Live caption processing",
      timestamp: Date.now()
    };

    res.json(caption);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

/* =====================================
   SERVER START
===================================== */

app.listen(PORT, () => {
  console.log(`B SMART API running on port ${PORT}`);
});
