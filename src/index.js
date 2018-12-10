import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import math from "mathjs";
import Mu from "./Mu.js";

var mu = new Mu();

document.getElementsByTagName("body")[0].style.overflow = "hidden";

let app = ReactDOM.render(<App />, document.getElementById("app"));

app.graph.set_dPixel(1);

app.graph.progress = app.progress;

app.refresh = function(e) {
	try{
		let values = app.getValues();
		app.graph.setValues(values);
		app.graph.graph(values.function);
		clearTimeout(app.graph.timeout);
		app.graph.timeout = setTimeout(() => {
			app.xy.refresh(app.graph.delayed(app.xy.state.selection));
		}, 10);
		console.log(app.xy.state);
	} catch(err){
		console.log(err);
	}
}

app.refresh();