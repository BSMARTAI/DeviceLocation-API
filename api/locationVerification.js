module.exports = (app) => {

app.post("/location-verification", (req, res) => {

    const phone = req.body.phoneNumber

    res.json({
        verified: true,
        phone: phone,
        latitude: 38.6270,
        longitude: -90.1994,
        carrier: "5G",
        network: "CAMARA"
    })

})

}
