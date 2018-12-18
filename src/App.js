import React from "react";
import SplitterLayout from "react-splitter-layout";
// import Button from "@material-ui/core/Button";
import {Button, ButtonGroup} from "react-bootstrap/lib";
import TextField from "@material-ui/core/TextField";

import Graph from "./Graph.js";
import ProgressBar from "./ProgressBar.js"
import XYTable from "./XYTable.js";
import color from "@material-ui/core/colors/indigo";

/**
 * The GUI!
 * Uses Material UI and Bootstrap (but still looks not as good as it could :( )
 * react-splitter-layout splits the input area from the graph.
 */

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
		this.styles = {
			center: {
				marginLeft: "auto",
				marginRight: "auto"
			}
		}
		
		this.buttons = {
			f_: false,
			f__: false
		}

		this.boxes = {
			xMin: "xMin",
			xMax: "xMax",
			yMin: "yMin",
			yMax: "yMax"
		}
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
			f_: this.buttons.f_,
			f__: this.buttons.f__
		}
	}
	render() {
	    return (
	        <div> 
	        	<SplitterLayout primaryIndex={0} percentage primaryMinSize={60} onSecondaryPaneSizeChange={() => {this.graph.dPixel = 2; this.refresh();}} onDragEnd={() => { this.graph.dPixel = 1; this.refresh(); }}>
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
				        		defaultValue="sin(x)/x" 
				        		onChange={() => { this.refresh(); }}
				        	/>
						</span>
						<br/>
						<ButtonGroup style={{width: '100%'}}>
							<Button bsStyle="danger" onClick={() => {this.buttons.f_ = !this.buttons.f_; this.refresh();}} active={this.buttons.f_}>f'(x)</Button>
							<Button bsStyle="success" onClick={() => {this.buttons.f__ = !this.buttons.f__; this.refresh();}} active={this.buttons.f__}>f''(x)</Button>
						</ButtonGroup>
						<br/>
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
			        			defaultValue="-7"
			        			onChange={() => { this.refresh(); }}
			        		/>,
			        		<TextField
			        			style={{width: '10%'}}
			        			id="yMax"
			        			defaultValue="7"
			        			onChange={() => { this.refresh(); }}
			        		/>
			        		]
			        	</span>
						<br/>
						<Button bsStyle="warning" onClick={() => {
							document.getElementById("xMin").value = "-10";
							document.getElementById("xMax").value = "10";
							document.getElementById("yMin").value = "-7";
							document.getElementById("yMax").value = "7";
							this.refresh();
						}}>Standard View </Button>
			        	<br/>
			        	<br/>
						<XYTable id="xy" ref={(_xy)=>{ this.xy = _xy; }} onChange={() => this.refresh()}></XYTable>
						<br/>
						<Button bsStyle="warning" onClick={() => {this.graph.integrate()}}>Integrate f'(x) on the Domain</Button>
						<br/>
						<span id="integral"></span>
						<br/>
						<span id="integral2"></span>
					</div>
	        	</SplitterLayout>
	        </div>
	    );
	}
};