const express = require("express");
const bodyParser = require("body-parser");
const cool = require("cool-ascii-faces");
const dataStore = require("nedb");
const path = require("path");
const cbpAPI = require(path.join(__dirname,"cbpAPI"));

const app = express();

app.use(bodyParser.json());

const port = process.env.PORT || 80;

//CBP
const dbFileName = path.join(__dirname,"cbp.db");
const db = new dataStore({
                filename: dbFileName,
				autoload: true
});

cbpAPI(app,db);

app.use("/",express.static("./public"))

app.get("/cool",(req,res) => {
	res.send("<html>"+cool()+"</html>");
});

const BASE_API_URL = "/api/v1";
var initialcbp = [
	
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
];
app.get(BASE_API_URL+"/cbp/loadInitialData",(req,res) =>{
	 console.log("New GET .../loadInitialData");
	 db.remove({}, { multi: true }, function (err, numRemoved) {
	 });	
	 db.insert(initialcbp);
	 res.sendStatus(200);
	
	console.log("Initial Cbp loaded:"+JSON.stringify(initialcbp,null,2));

});


//GETS


app.get(BASE_API_URL+"/cbp",(req,res) => {
	res.send(JSON.stringify(cbp,null,2));
});







//POSTS

app.post(BASE_API_URL+"/cbp",(req,res) => {
	cbp.push(req.body);
	res.sendStatus(201,"CREATED");
});

		
app.listen(port, ()=>{
	console.log("Server ready")
});

console.log("Starting server");


