const express = require("express");
const app = express();
const config = require("config");
const therapists = require("./routes/therapists");
const bookings = require("./routes/bookings");
const ratings = require("./routes/ratings");

app.use(express.json());
app.use("/therapists", therapists);
app.use("/bookings", bookings);
app.use("/ratings", ratings);

app.get("/" , (req, res)=>{
    res.send("Welcome to SportStretch!");
})

const port = process.env.PORT || config.get("port");

app.listen(port, () => {
 console.log("Server running on port " + port);
});