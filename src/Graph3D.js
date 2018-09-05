import React from "react"

import math from "mathjs";
import brent from "./brent.js";

export default class Graph3D extends React.component{
	constructor(props){
		super(props);
		this.canvas;
		this.ctx;

		this.outlook = {
			x: 1, y: 1, z: 1
		}
	}
}