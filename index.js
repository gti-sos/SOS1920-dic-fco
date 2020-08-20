const express = require("express");
const bodyParser = require("body-parser");
const path = require ("path");

const cbpAPI =require(path.join(__dirname,"./src/back/cbpAPI"));

var app = express();

app.use(bodyParser.json());


cbpAPI(app);

var port = process.env.PORT || 9999;

app.use("/", express.static("./public"));

app.listen(port, () => {
    console.log("Server ready on port " + port);
});

console.log("Starting server...");