var express = require("express");//Getting express
var app = express(); //starting it
var port = 3000; //declaring port as 3000
var bodyParser = require('body-parser');
app.use(bodyParser.json()); //to use middleware
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/mylib"); //connecting to database mylib
var nameSchema = new mongoose.Schema( //schema of the data
	{
		note: String
	});

var notes = mongoose.model("notes",nameSchema);  // connecting to notes table

app.get("/",(req,res) => {
	notes.find((err,note) => {
		if(err)
			res.status(500).send(err);
				res.render('front',{note:note});
	});
});
app.get("/create", (req,res) => {
	res.sendFile(__dirname+"/create.html");
});


app.post("/addname",(req,res) => {
	var myData = new notes(req.body);
	myData.save()
	.then(item=>{
		console.log("item inserted");
		notes.find((err,note) => {
		if(err)
			res.status(500).send(err);
				res.render('front',{note:note});
	});
	})
	.catch(err => {
		res.status(400).send("Unable to save to database");
	});
});  
app.post("/new_data",(req,res)=>{
	notes.findById(req.body.id, function (err,note) {
		if(err)
			res.status(500).send(err);
		res.render('update_and_store',{note:note});
	});
});
app.get("/update", (req,res) => {
	res.sendFile(__dirname + "/update.html");
});
app.listen(port,()=>
	{
		console.log("Server listening on port " + port);
	});
app.get("/delete", (req,res) => {
	res.sendFile(__dirname + "/delete.html");
});
app.post("/update_data", (req,res) => {
	notes.findByIdAndUpdate(req.body.id,req.body,{new:true}, (err,note)=>{
		if(err)
			res.status(500).send(err);
		console.log(req.body.note);
		notes.find((err,note) => {
		if(err)
			res.status(500).send(err);
				res.render('front',{note:note});
	});
	});
});
app.post("/delete_and_back", (req,res) => {
	notes.findByIdAndRemove(req.body.id, (err,note) =>{
		if(err)
			res.status(500).send(err);

		console.log("Removed data whose id is "+ note._id);
		notes.find((err,note) => {
		if(err)
			res.status(500).send(err);
				res.render('front',{note:note});
	});
	});
});
