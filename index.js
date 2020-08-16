const cool = require("cool-ascii-faces");
const express = require("express");

var app = express();

app.get("/cool",(req,res) => {
	res.send("<html>"+cool()+"</html>");
});
		
app.listen(80);

console.log("server ready");
