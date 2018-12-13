import React from "react";
import ReactDOM from "react-dom";
import MQ from "mathquill";
import App from "./App.js";
import simpsons from "./simpsons.js";

document.getElementsByTagName("body")[0].style.overflow = "hidden";

let app = ReactDOM.render(<App />, document.getElementById("app"));

app.graph.set_dPixel(1);

console.log(simpsons(-10,10,10000,"x^2"));

// app.graph.progress = app.progress;

app.refresh = function(e) {
	try{
		let values = app.getValues();
		app.graph.setValues(values);
		app.graph.graph(values.function);
		clearTimeout(app.graph.timeout);
		app.graph.timeout = setTimeout(() => {
			app.xy.refresh(app.graph.delayed(app.xy.state.selection));
		}, 10);
	} catch(err){
		console.log(err);
	}
}

app.refresh();