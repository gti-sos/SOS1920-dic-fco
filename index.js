const cool = require("cool-ascii-faces");
const express = require("express");
const bodyParser = require("body-parser");


var app = express();
app.use(bodyParser.json());

var port = process.env.PORT || 80;

app.use("/",express.static("./public"))

var cbp = [
	
	{
		country:"India",
		year:2020,
		np:1375351000,
		pwp:18.13,
		aapc:1.64   
	},
	{
		country:"China",
		year:2020,
		np:1409451000,
		pwp:18.05,
		aapc:0.48   
	},
	{
		country:"U.S",
		year:2020,
		np:330135000,
		pwp:4.27,
		aapc:0.71  
	},
	{
		country:"Spain",
		year:2020,
		np:47329981,
		pwp:0.61,
		aapc:0.47   
	},
	{
		country:"Germany",
		year:2020,
		np:83157201,
		pwp:1.07,
		aapc:0.41   
	},
]

const BASE_API_URL = "/api/v1";

app.get(BASE_API_URL+"/cbp",(req,res) => {
	res.send(JSON.stringify(cbp,null,2));
});

app.post(BASE_API_URL+"/cbp",(req,res) => {
	cbp.push(req.body);
	res.sendStatus(201,"CREATED");
});


app.get("/cool",(req,res) => {
	res.send("<html>"+cool()+"</html>");
});
		
app.listen(port, ()=>{
	console.log("Server ready")
});

console.log("Starting server");


