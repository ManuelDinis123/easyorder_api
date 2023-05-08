const express = require("express");
const app = express();
var jwt = require("jsonwebtoken");
const jwtKey = "my_secret_key";

app.post("/generate", async (req, res) => {
    try {
        const email = req.headers.email;

        // Create token
        const token = jwt.sign(
            {
                email,
            },
            jwtKey
        );

        return res.status(200).json(token);
    } catch (err) {
        console.log(err);
    }
});

module.exports = app;