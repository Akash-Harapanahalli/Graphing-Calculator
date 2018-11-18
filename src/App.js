import React from "react";
import SplitterLayout from "react-splitter-layout";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";

import Graph from "./Graph.js";
import ProgressBar from "./ProgressBar.js"
import XY from "./XY.js";
import XYTable from "./XYTable.js";
import MathInput from "./MathInput.js";

export default class App extends React.Component {
	constructor(props){
		super(props);
		this.graph;
		this.progress;
		this.xy;
		this.styles = {
			textBoxSize: {
				fontSize: 50
			}
		};

		this.points;
	}
	refresh(e){
		// TO BE OVERRIDEN
	}
	getValues(){
		return {
			function: document.getElementById("function").value,
			xMin: document.getElementById("xMin").value,
			xMax: document.getElementById("xMax").value,
			yMin: document.getElementById("yMin").value,
			yMax: document.getElementById("yMax").value,
			f_: document.getElementById("f'(x)").checked,
			f__: document.getElementById("f''(x)").checked
		}
	}
	render() {
	    return (
	        <div> 
	        	<ProgressBar ref={(_progress) => { this.progress = _progress; }}/>
	        	<SplitterLayout primaryIndex={0} percentage primaryMinSize={60} onDragEnd={() => { this.refresh(); }}>
		            <div>
			            <div id="graphDIV">
			            	<Graph id="graph" ref={(_graph)=>{ this.graph = _graph; }} container="graphDIV"/>
			        	</div>
		        	</div>
		        	<div>
		        		<span>
		        			f(x)=
				        	<TextField 
				        		style={{width: '80%'}} 
				        		id="function" 
				        		defaultValue="sin(x)" 
				        		onChange={() => { this.refresh(); }}
				        	/>
			        	</span>
			        	<br/>
			        	f'(x)
			        	<Checkbox
			        		id="f'(x)"
			        		onChange={() => { this.refresh(); }}
			        		defaultChecked={false}
						/>
			        	f''(x)
			        	<Checkbox
			        		id="f''(x)"
			        		onChange={() => { this.refresh(); }}
			        		defaultChecked={false}
			        	/>
			        	<br/>
			        	<span>
			        		D: [ 
			        		<TextField
			        			style={{width: '10%'}}
			        			id="xMin"
			        			defaultValue="-10"
			        			onChange={() => { this.refresh(); }}
			        		/>,
			        		<TextField
			        			style={{width: '10%'}}
			        			id="xMax"
			        			defaultValue="10"
			        			onChange={() => { this.refresh(); }}
			        		/>
			        		]
			        	</span>
			        	<br/>
			        	<span>
			        		R: [ 
			        		<TextField
			        			style={{width: '10%'}}
			        			id="yMin"
			        			defaultValue="-10"
			        			onChange={() => { this.refresh(); }}
			        		/>,
			        		<TextField
			        			style={{width: '10%'}}
			        			id="yMax"
			        			defaultValue="10"
			        			onChange={() => { this.refresh(); }}
			        		/>
			        		]
			        	</span>
			        	<br/>
			        	<div>
			            	<Button style={{width: '100%', height: '100px'}} variant="contained" color="secondary" onClick={() => { this.refresh(); }}>Graph</Button>
			            </div>
						<XYTable id="xy" ref={(_xy)=>{ this.xy = _xy; }}></XYTable>
		            </div>
	        	</SplitterLayout>
	        </div>
	    );
	}
};