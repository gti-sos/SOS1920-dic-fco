module.exports = function (app) {
	console.log("Registering cbp API...");
	const dataStore = require("nedb");
	const path = require("path");
	const dbFileName = path.join(__dirname, "cbp.db");
	const db = new dataStore({
		filename: dbFileName,
		autoload: true
	});

	const BASE_API_URL = "/api/v1";

	const request = require('request');
	const express = require("express");

	var initialcbp = [

		{
			country: "India",
			year: 2020,
			yfed: 43,
			pwp: 18.13,
			aapc: 1.64
		},
		{
			country: "Italy",
			year: 2020,
			yfed: 230,
			pwp: 0.78,
			aapc: 0.30
		},
		{
			country: "Portugal",
			year: 2019,
			yfed: 230,
			pwp: 0.13,
			aapc: -0.31
		},
		{
			country: "Belgium",
			year: 2020,
			yfed: 139,
			pwp: 0.15,
			aapc: 0.50
		},
		{
			country: "Ireland",
			year: 2019,
			yfed: 55,
			pwp: 0.06,
			aapc: 1.26
		},
		{
			country: "China",
			year: 2020,
			yfed: 144,
			pwp: 18.05,
			aapc: 0.48
		},
		{
			country: "U.S",
			year: 2020,
			yfed: 99,
			pwp: 4.27,
			aapc: 0.71
		},
		{
			country: "Spain",
			year: 2020,
			yfed: 147,
			pwp: 0.61,
			aapc: 0.47
		},
		{
			country: "Germany",
			year: 2020,
			yfed: 169,
			pwp: 1.07,
			aapc: 0.41
		},
	];

	//Integraciones
	/////////////////////////////////////////
	////////////////////////////////////////

	//RLN
	const URL_1 = 'https://sos1920-sep-rnl.herokuapp.com';
	app.use("/api/v1/mercados", function (req, res) {
		console.log("GET API MERCADOS");
		var url = URL_1 + req.baseUrl + req.url;
		console.log("URL_RLN: " + url);
		console.log('piped: ' + req.baseUrl + req.url);
		req.pipe(request(url)).pipe(res);
	});
	app.use(express.static('.'));

	//GRUPO 10
	const URL_2 = 'https://sos1920-10.herokuapp.com';
	app.use("/api/v3/global-marriages", function (req, res) {
		console.log("GET API Marriages");
		var url = URL_2 + req.baseUrl + req.url;
		console.log("URL_Grupo_10: " + url);
		console.log('piped: ' + req.baseUrl + req.url);
		req.pipe(request(url)).pipe(res);
	});
	app.use(express.static('.'));

	//GRUPO 12
	const URL_3 = 'https://sos1920-12.herokuapp.com';
	app.use("/api/v2/school-dropouts", function (req, res) {
		console.log("GET API school-dropouts");
		var url = URL_3 + req.baseUrl + req.url;
		console.log("URL_Grupo_12: " + url);
		console.log('piped: ' + req.baseUrl + req.url);
		req.pipe(request(url)).pipe(res);
	});
	app.use(express.static('.'));

	//GRUPO 29
	const URL_4 = 'https://sos1920-29.herokuapp.com';
	app.use("/api/v2/emp-stats", function (req, res) {
		console.log("GET API emp-stats");
		var url = URL_4 + req.baseUrl + req.url;
		console.log("URL_Grupo_29: " + url);
		console.log('piped: ' + req.baseUrl + req.url);
		req.pipe(request(url)).pipe(res);
	});
	app.use(express.static('.'));






	function deleteIDs(cbp) {
		cbp.forEach((m) => {
			delete m._id;
		});
	}


	//INITIAL DATA	
	app.get(BASE_API_URL + "/cbp/loadInitialData", (req, res) => {
		console.log("New GET .../loadInitialData");
		db.remove({}, { multi: true }, function (err, numRemoved) {
		});
		db.insert(initialcbp);
		res.sendStatus(200);

		console.log("Initial cbp loaded:" + JSON.stringify(initialcbp, null, 2));

	});

	// GET 
	app.get(BASE_API_URL + "/cbp", (req, res) => {
		console.log("New GET cbp");

		//if(req.query.country) request["country"] = req.query.country;
		if (req.query.year) req.query.year = parseInt(req.query.year);
		if (req.query.yfed) req.query.yfed = parseInt(req.query.yfed);
		if (req.query.pwp) req.query.pwp = parseFloat(req.query.pwp);
		if (req.query.aapc) req.query.aapc = parseFloat(req.query.aapc);

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



		db.find(par).skip(offset).limit(limit).exec((err, cbp) => {
			deleteIDs(cbp);
			res.send(JSON.stringify(cbp, null, 2));

			console.log("Data sent: " + JSON.stringify(cbp, null, 2));
		});
	});
	// GET yyyy/XXX

	app.get(BASE_API_URL + "/cbp/:country", (req, res) => {
		var country1 = req.params.country;
		db.find({ country: country1 }, (err, cbp) => {
			deleteIDs(cbp);
			res.send(JSON.stringify(cbp, null, 2));
			console.log("Data sent:" + JSON.stringify(cbp, null, 2));
		});
	});

	// GET yyyy/XXX/zzz
	app.get(BASE_API_URL + "/cbp/:country/:year", (req, res) => {

		var country1 = req.params.country;
		var year1 = req.params.year;
	
		db.find({ country: country1, year: Number(year1) }, (err, cbp) => {
			deleteIDs(cbp);
			res.send(JSON.stringify(cbp[0], null, 2));
			console.log("Data sent:" + JSON.stringify(cbp[0], null, 2));
			if (err == !0) {
				res.sendStatus(404, "COUNTRY NOT FOUND");
			}
	
		});
	
	});
	// POST
	app.post(BASE_API_URL + "/cbp", (req, res) => {
		var newcbp = req.body;
		if ((newcbp == "") || (newcbp.country == null) || (newcbp.country == "") || (newcbp.year == null) || (newcbp.year == "") || (newcbp.yfed == null)) {
			res.sendStatus(400, "BAD REQUEST");
		} else {
			db.find({ country: newcbp.country, year: Number(newcbp.year) }, (err, cbp) => {
				if (cbp.length == 0) {
					db.insert(newcbp);
					res.sendStatus(201, "CREATED");
				} else {
					res.sendStatus(410, "BAD REQUEST");
				}
			});
		}
	});

	//POST yyyy/xxxx
	app.post(BASE_API_URL + "/cbp/:country", (req, res) => {
		res.sendStatus(405, "METHOD NOT ALLOWED");
	});
	//POST yyyy/xxxx/zzzz
	app.post(BASE_API_URL + "/cbp/:country/:year", (req, res) => {
		res.sendStatus(405, "METHOD NOT ALLOWED");
	});

	// DELETE 
	app.delete(BASE_API_URL + "/cbp", (req, res) => {
		db.remove({}, { multi: true }, function (err, numRemoved) {
			if (numRemoved != 0) {
				res.sendStatus(200, "DELETED DATA BASE");
			} else {
				res.sendStatus(404, "DATA BASE NOT FOUND");
			}
		});
	});
	// DELETE yyyy/XXX

	app.delete(BASE_API_URL + "/cbp/:country", (req, res) => {

		var country1 = req.params.country;

		db.remove({ country: country1 }, { multi: true }, function (err, numRemoved) {
			if (numRemoved != 0) {
				res.sendStatus(200, "DELETED COUNTRY");
			} else {
				res.sendStatus(404, "COUNTRY NOT FOUND");
			}
		});
	});
	// DELETE yyyy/XXX/zzz

	app.delete(BASE_API_URL + "/cbp/:country/:year", (req, res) => {

		var country1 = req.params.country;
		var year1 = req.params.year;
		db.remove({ country: country1, year: Number(year1) }, {}, function (err, numRemoved) {
			if (numRemoved != 0) {
				res.sendStatus(200, "DELETED COUNTRY");
			} else {
				res.sendStatus(404, "COUNTRY NOT FOUND");
			}
		});
	});
	//PUT yyyy
	app.put(BASE_API_URL + "/cbp", (req, res) => {
		res.sendStatus(405, "METHOD NOT ALLOWED");
	});
	// PUT yyyy/XXX/zzz
	app.put(BASE_API_URL + "/cbp/:country/:year", (req, res) => {

		var country1 = req.params.country;
		var year1 = req.params.year;
		var body = req.body;

		db.find({ country: country1, year: Number(year1) }, (err, cbp) => {
			deleteIDs(cbp);
			if (cbp.length >= 1) {
				db.update({ country: country1, year: Number(year1) }, body, (error, numRemoved) => {
					res.sendStatus(200, "OK");
				})
			} else {
				res.sendStatus(404, "ERROR. Pais no encontrado.");
			}
		});
	});
	console.log("cbp OK");
};











