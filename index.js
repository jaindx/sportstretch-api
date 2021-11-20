const express = require("express");
const app = express();
const therapists = require("./routes/therapists");
const config = require("config");

app.use(express.json());
app.use("/therapists", therapists);

app.get("/" , (req, res)=>{
    res.send("Welcome to SportStretch!");
})

const port = process.env.PORT || config.get("port");

app.listen(port, () => {
 console.log("Server running on port " + port);
});