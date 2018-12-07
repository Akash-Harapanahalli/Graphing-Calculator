import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import math from "mathjs";

document.getElementsByTagName("body")[0].style.overflow = "hidden";

let app = ReactDOM.render(<App />, document.getElementById("app"));

app.graph.set_dPixel(1);

app.graph.progress = app.progress;

app.refresh = function(e) {
	try{
		let values = app.getValues();
		app.graph.setValues(values);
		app.graph.graph(values.function);
		setTimeout(() => {
			app.xy.refresh(app.graph.delayed());
		}, 1000);
		console.log(app.xy.state);
	} catch(err){
		console.log(err);
	}
}

app.refresh();