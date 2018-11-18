import React from "react";
import ReactDOM from "react-dom";
import math from "mathjs";
import App from "./App.js";
// import App2 from "./App2.js"
import brent from "./brent.js";

// console.log(brent(-10,10,100,(x)=>{return Math.sin(x)}));

document.getElementsByTagName("body")[0].style.overflow = "hidden";

let app = ReactDOM.render(<App />, document.getElementById("app"));

app.graph.set_dPixel(1);

app.graph.progress = app.progress;

app.refresh = function(e) {
	try{
		let values = app.getValues();
		app.graph.setValues(values);
		app.xy.refresh(app.graph.graph(values.function));
	} catch(err){
		console.log(err);
	}
}

app.refresh();