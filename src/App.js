import React from "react";
import ReactDOM from "react-dom";
// import MathQuill from "node-mathquill";

import SplitterLayout from "react-splitter-layout"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"

import Graph from "./Graph.js";

export default class App extends React.Component {
	constructor(props){
		super(props);
		this.graph;
	}
	buttonOnClick(e){
		console.log("old");
	}
	getFunction(){
		return document.getElementById("function").value;
	}
	render() {
	    return (
	        <div>
	        	<SplitterLayout primaryIndex={0} percentage primaryMinSize={60} onDragEnd={() => { this.buttonOnClick(); }}>
		            <div>
			            <div id="graphDIV" style={{padding: '0px'; margin: '0px';}}>
			            	<Graph id="graph" ref={(_graph)=>{ this.graph = _graph; }}/>
			        	</div>
		        	</div>
		        	<div style={this.leftpadfix}>
			        	<div>
			        		f(x) = <TextField id="function" defaultValue="x ^ 2" onChange={() => { this.buttonOnClick(); }}/>
			        	</div>
			        	<br/>
			        	<div>
			            	<Button variant="contained" color="secondary" onClick={() => { this.buttonOnClick(); }}>Graph</Button>
			            </div>
		            </div>
	        	</SplitterLayout>
	        </div>
	    );
	}
	componentDidMount() {

	}
};