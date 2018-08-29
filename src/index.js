import React from "react";
import ReactDOM from "react-dom";
import math from "mathjs";
import App from "./App.js";
import brent from "./brent.js";

// console.log(brent(-10,10,100,(x)=>{return Math.sin(x)}));

document.getElementsByTagName("body")[0].style.overflow = "hidden";

let app = ReactDOM.render(<App />, document.getElementById("app"));

app.graph.fullscreen();
app.graph.graph(app.getFunction());

app.graph.set_dPixel(0.1);

app.buttonOnClick = function(e) {
	app.graph.fullscreen();
	app.graph.graph(app.getFunction());
	try{
		console.log("Zeros: " + app.graph.fzeros());
	} catch(err){
		// Just do nothing LOL
	}
}

app.graph.mousemove = function(e){
	console.log("yay");
	app.buttonOnClick();
}