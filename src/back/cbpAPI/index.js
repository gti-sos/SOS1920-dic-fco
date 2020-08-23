module.exports = function(app){
	console.log("Registering cbp API...");
	const dataStore = require("nedb");
	const path = require("path");
	const dbFileName = path.join(__dirname,"cbp.db");
	const db = new dataStore({
                filename: dbFileName,
				autoload: true
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
	
	
	function deleteIDs (cbp){
        cbp.forEach( (m) => {
            delete m._id;
        });
    }
	
//INITIAL DATA	
app.get(BASE_API_URL+"/cbp/loadInitialData",(req,res) =>{
	 console.log("New GET .../loadInitialData");
	 db.remove({}, { multi: true }, function (err, numRemoved) {
	 });	
	 db.insert(initialcbp);
	 res.sendStatus(200);
	
	console.log("Initial cbp loaded:"+JSON.stringify(initialcbp,null,2));
 
});

// GET 
app.get(BASE_API_URL+"/cbp", (req,res) =>{
	console.log("New GET cbp");
	
	//if(req.query.country) request["country"] = req.query.country;
    if(req.query.year) req.query.year = parseInt(req.query.year);
    if(req.query.np) req.query.np = parseInt(req.query.np);
    if(req.query.pwp) req.query.pwp = parseFloat(req.query.pwp);
    if(req.query.aapc) req.query.aapc = parseFloat(req.query.aapc);
	
	var par = req.query;
    console.log(par);
	
	let offset = null;
	let limit = null;
  
    if (req.query.offset) {
        offset = parseInt(req.query.offset);
        delete req.query.offset;
	}
    if (req.query.limit) {
        limit = parseInt(req.query.limit);
        delete req.query.limit;
    }  
	
	
	db.find(par).skip(offset).limit(limit).exec((err, cbp)=> {
        deleteIDs(cbp);
		res.send(JSON.stringify(cbp,null,2));
		
         console.log("Data sent: "+JSON.stringify(cbp,null,2));
        });
    });
// GET yyyy/XXX

app.get(BASE_API_URL+"/cbp/:country", (req,res)=>{
	var country1 = req.params.country;
	db.find({country: country1}, (err,cbp)=>{
		deleteIDs(cbp);
		res.send(JSON.stringify(cbp,null,2));
		console.log("Data sent:"+JSON.stringify(cbp,null,2));
	});
});
	
// GET yyyy/XXX/zzzs
app.get(BASE_API_URL+"/cbp/:country/:year", (req,res)=>{
	
	var country1 = req.params.country;
	var year1 = req.params.year;
	
	db.find({country: country1, year: Number(year1)}, (err,cbp)=>{
		deleteIDs(cbp);
		res.send(JSON.stringify(cbp[0],null,2));
		console.log("Data sent:"+JSON.stringify(cbp[0],null,2));
		//ruben pasa código
	});
});
	
// POST
app.post(BASE_API_URL+"/cbp",(req,res) =>{
	var newcbp = req.body;
	if((newcbp == "") || (newcbp.country == null)||(newcbp.year == null)||(newcbp.np == null)||(newcbp.pwp == null)||(newcbp.aapc == null)/*||(newcbp.aapc == "")*/){
		res.sendStatus(400,"BAD REQUEST");		
	} else {
		db.find({country: newcbp.country, year: Number(newcbp.year)}, (err,cbp)=>{
			if(cbp.length ==0){
				db.insert(newcbp); 	
				res.sendStatus(201,"CREATED");
			}else{
				res.sendStatus(400,"BAD REQUEST");
			}
		});
	}
});
	
//POST yyyy/xxxx
app.post(BASE_API_URL+"/cbp/:country",(req,res) =>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});
//POST yyyy/xxxx/zzzz
app.post(BASE_API_URL+"/cbp/:country/:year",(req,res) =>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});
	
// DELETE 
app.delete(BASE_API_URL+"/cbp", (req,res) =>{
	db.remove({}, { multi: true }, function (err, numRemoved) {
		if (numRemoved!=0) {
        	res.sendStatus(200, "DELETED DATA BASE");
    	}else{
        	res.sendStatus(404, "DATA BASE NOT FOUND");
    	}
	});	
});
// DELETE yyyy/XXX

app.delete(BASE_API_URL+"/cbp/:country", (req,res)=>{
	
	var country1 = req.params.country;
	
	db.remove({country:country1}, { multi: true }, function (err, numRemoved) {
		if(numRemoved!=0){
			res.sendStatus(200, "DELETED COUNTRY");
    	}else{
        	res.sendStatus(404, "COUNTRY NOT FOUND");
    	}
	});	
});	
// DELETE yyyy/XXX/zzz

app.delete(BASE_API_URL+"/cbp/:country/:year", (req,res)=>{
	
	var country1 = req.params.country;
	var year1 = req.params.year;
	db.remove({country:country1, year: Number(year1)}, {}, function (err, numRemoved) {
		if(numRemoved!=0){
			res.sendStatus(200, "DELETED COUNTRY");
    	}else{
        	res.sendStatus(404, "COUNTRY NOT FOUND");
    	}
	});
});	
//PUT yyyy
app.put(BASE_API_URL+"/cbp", (req,res)=>{
	res.sendStatus(405,"METHOD NOT ALLOWED");
});	
// PUT yyyy/XXX/zzz
app.put(BASE_API_URL+"/cbp/:country/:year", (req,res)=>{
	
	var country1 = req.params.country;
	var year1 = req.params.year;
	var body = req.body;
	
	db.find({country: country1, year: Number(year1)}, (err, cbp) => {
		deleteIDs(cbp);
		if(cbp.length >= 1){
			db.update({country: country1,year:Number(year1)}, body, (error, numRemoved) => {
				res.sendStatus(200, "OK");
			})
		}else{
			res.sendStatus(404,"ERROR. Pais no encontrado.");
		}
	});
});	
	console.log("cbp OK");  
};