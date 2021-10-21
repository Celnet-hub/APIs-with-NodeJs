//let express = require('express');
//import express from 'express';
import express from "express";
let app = express();
import fetch from "node-fetch";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

let connection_count = 0;

// Middleware to parse the body of the request
app.use(express.json());

//login to remote server
app.post("/remote-api/login", function (req, res) {
	
	// create credentials to login to remote server 1
	let hashed_password = bcrypt.hashSync(req.body.password, 10);

	let credentials = {
		password: hashed_password,
		username: req.body.username,
		id: req.body.id,
	};

	// post to remote server
	let postOption = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(credentials),
	};
	fetch("http://localhost:3001/api/login", postOption)
		.then((res) => res.json()) // parse response as JSON. Can be res.text() for plain response
		.then((data) => { // data is the response from the API which has been converted to JSON
			console.log(data);
			res.send(data);
		})
		.catch((err) => {
			console.log(err);
			res.send(err);
		});
});

// get data from remote server.
app.get("/remote-api/getData", (req, res) => {
	// do something
	let options = {
		method: 'GET',
		headers: {
			"Content-Type": "application/json",
			"Authorization": req.headers.authorization
		}
	};

	fetch("http://localhost:3001/api", options)
		.then((res) => res.json())
		.then((data) => {
			res.send(data);
			console.log('Data received from remote');
		})
		.catch((err) => {
			console.log(err);
			res.send(err);
		});
});

// start server
let port = 3002;
app.listen(port, function () {
	console.log(`API 2 Server Live on port ${port}`);
});
