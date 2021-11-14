var express = require("express");
var app = express();

app.get("/url", (req, res, next) => {
    res.json(["Hello World"]);
   });
const PORT = process.env.port || 3000;

app.listen(PORT, () => {
 console.log("Server running on port " + PORT);
});