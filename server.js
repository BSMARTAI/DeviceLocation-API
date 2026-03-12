const express = require("express")
const app = express()

app.use(express.json())

app.post("/location-verification", (req, res) => {

    const phone = req.body.phoneNumber

    res.json({
        verified: true,
        phone: phone,
        latitude: 38.6270,
        longitude: -90.1994,
        carrier: "5G"
    })

})

app.get("/location-retrieval", (req, res) => {

    res.json({
        latitude: 38.6270,
        longitude: -90.1994,
        city: "St Louis"
    })

})

app.listen(3000, () => {
    console.log("Telecom API Gateway running on port 3000")
})
