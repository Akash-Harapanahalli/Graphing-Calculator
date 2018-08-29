import React from "react";
import ReactDOM from "react-dom";

import math from "mathjs";

import MathQuill from "mathquill";

export default class MathInput extends React.Component {
	constructor(props){
		super(props);
		this.MQ = MathQuill.getInterface(2);
		this.mathFieldSpan;
		this.mathField;
	}
	render(){
		return (
			<span 
				id={this.props.id}
				style={this.props.style}
			/>
		)
	}
	componentDidMount(){
		this.mathFieldSpan = document.getElementById(this.props.id);
		this.mathField = this.MQ.MathField(this.mathFieldSpan, {
			// CONFIGURABLES
		});
	}
}