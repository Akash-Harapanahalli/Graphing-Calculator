import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import simpsons from "./simpsons.js";

import Bootstrap from "bootstrap/dist/css/bootstrap.css";

document.getElementsByTagName("body")[0].style.overflow = "hidden";

let app = ReactDOM.render(<App />, document.getElementById("app"));

app.graph.set_dPixel(1);

localStorage.clear();
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

app.graph.mouseDown = function(e){
	app.graph.captureMouseDown(e, app.boxes);
}

app.graph.mouseMove = function(e){
	if(app.graph.drag.isDown){
		app.graph.captureMouseMove(e, app.boxes);
		app.refresh();
	}
}

app.graph.mouseUp = function(e){
	app.graph.captureMouseUp(e);
}

app.graph.scroll = function(e){
	app.graph.captureScroll(e, app.boxes);
	app.refresh();
}