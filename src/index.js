import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";

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