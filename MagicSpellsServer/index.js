var express = require("express");
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session");

var fs = require("fs");

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

var server = app.listen(3000, function() {
  console.log("Express server has started on port 3000");
});

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(
  session({
    secret: "@#@$MYSIGN#@$#$",
    resave: false,
    saveUninitialized: true
  })
);

var options = {
	encoding: "utf-8",
	method: "GET",
	uri: "https://ko.wikipedia.org/wiki/%ED%95%B4%EB%A6%AC_%ED%8F%AC%ED%84%B0%EC%9D%98_%EB%A7%88%EB%B2%95_%EB%AA%A9%EB%A1%9D"
};

request(options, function(err,res,html){
	var $ = cheerio.load(html);
	var index = 5;
	var magicSpells = {};
	var flag = false;
	while(!flag){
		if($("#mw-content-text > div > h2:nth-child("+index+")").text()!="" || index==148){
			index++;
		}
		var title = $("#mw-content-text > div > ul:nth-child("+index+") > li > b").text();
		if(title==""){
			flag = false;
			break;
		}
		var entitle;
		if(index==161 || index>=181){
			entitle = $("#mw-content-text > div > ul:nth-child("+index+") > li").text().replace(/([가-힣\s]+)\(/g, '').replace(')', '');
		}else {
			entitle = $("#mw-content-text > div > ul:nth-child("+index+") > li > span").text().replace('(', '').replace(')', '');
		}
		index++;

		var effect = $("#mw-content-text > div > dl:nth-child("+index+") > dd:nth-child(1)").text();
		var source = $("#mw-content-text > div > dl:nth-child("+index+") > dd:nth-child(2)").text();
		index++;

		var spell = {"title": title, "effect": effect, "source": source};
			magicSpells[entitle] = spell;
		// console.log(magicSpells[entitle]);
	}
	// console.log(magicSpells);
	fs.writeFile(
		__dirname + "/data/spells.json",
		JSON.stringify(magicSpells, null, "\t"),
		"utf8",
		function(err, data) {
		  result = { success: 1 };
		  console.log(result);
	});

});
var router = require("./routes/main")(app, fs);
