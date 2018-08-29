import React from "react";
import ReactDOM from "react-dom";
import SplitterLayout from "react-splitter-layout"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Checkbox from "@material-ui/core/Checkbox"

import Graph from "./Graph.js";
import MathInput from "./MathInput.js"

export default class App extends React.Component {
	constructor(props){
		super(props);
		this.graph;
		this.styles = {
			textBoxSize: {
				fontSize: 50
			}
		}
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
			            <div id="graphDIV">
			            	<Graph id="graph" ref={(_graph)=>{ this.graph = _graph; }}/>
			        	</div>
		        	</div>
		        	<div>
		        		<span>
		        		<MathInput id="meme" style={{width: '100%'}} />
				        	<TextField 
				        		style={{width: '100%'}} 
				        		inputstyle={{fontSize: '100px'}} 
				        		id="function" 
				        		defaultValue="x ^ 3" 
				        		onChange={() => { this.buttonOnClick(); }}
				        	/>
			        	</span>
			        	<div>
			            	<Button style={{width: '100%', height: '100px'}} variant="contained" color="secondary" onClick={() => { this.buttonOnClick(); }}>Graph</Button>
			            </div>
		            </div>
	        	</SplitterLayout>
	        </div>
	    );
	}
};