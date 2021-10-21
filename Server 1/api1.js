let express = require("express");
let app = express();
let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");
require("dotenv").config();

// parse the request body into a readable format
app.use(express.json());

// middleware to protect route from unauthorized user.



function verifyToken(req, res, next) {
	let bearerHeader = req.headers["authorization"];
	//console.log(req.headers);
	console.log('incoming from server to verify token');
	if (bearerHeader !== undefined) {
		let bearer = bearerHeader.split(" ");
		let bearerToken = bearer[1];
		req.token = bearerToken;
		//console.log(req.token);
		next();
	} else {
		// response with a status code of 401 and a message
		res.send("Unauthorized to access resource");
		console.log('remote server could not verify');
	}
}

// response to requests
let messages = (status, data) => {
	if (status == 200) {
		return `${data} has been sent to remote`;
	} else {
		return "Error";
	}
};

let data = [
	{
		id: 1,
		name: "John",
		age: 30,
	},
];

// create credentials
let credentials = {
	password: process.env.PASSWORD,
	username: "Chidubem",
	id: 1,
};

app.post("/",(req, res) => {
	res.send(req.body);
	//console.log(req.body);
	//console.log('data has been sent');
});

app.get("/api", verifyToken, (req, res) => {
	//console.log('incoming from remote');
	// verify the token
	jwt.verify(req.token, process.env.SECRET, (err, authData) => {
		if (err) {
			res.send(JSON.stringify({
				Error:err.message,
				message: "Unauthorized to access resource",
				description: "Please login to access resource as access token may have expired.",
			}));
		} else {
			res.send(JSON.stringify({
				message: "Authorized",
				authData,
				keyExp: authData.exp,
				data,
				Date: new Date(),
			}));
			console.log('Token Verified');
		}
});

});

//create a token on post request
let token = jwt.sign(
	{
		username: credentials.username,
		id: credentials.id,
	},
	process.env.SECRET,
	{
		expiresIn: "60s",
	},
);

//route to handle login from remote server
app.post("/api/login", function (req, res) {
	console.log(req.headers);
	//if the credentials are correct
	if (
		credentials.username == req.body.username &&
		bcrypt.compareSync(credentials.password, req.body.password)
	) {
		res.status(200).json({
			message: "Login Successful",
			token: token,
		});
	} else {
		res.status(500).json({
			status: 500,
			message: "Login failed",
		});
	}
});

// app.get('/unauth', (req, res) => {
// 	res.send('welcome to the unauth session')
// 	console.log('incoming from server 2')
// });

// start server
let port = 3001;
app.listen(port, function () {
	console.log(`API 1 Server Live on port ${port}`);
});
