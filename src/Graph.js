import React from "react";
import ReactDOM from "react-dom";

import math from "mathjs";
import brent from "./brent.js";

export default class Graph extends React.Component {
	constructor(props){
		super(props);
		this.canvas;
		this.ctx;
		this.mousemove;
		this.general = {
			x: {
	            min: -10,
	            max: 10,
	            pixelCount: 1000,
	            origin: 500
	        },
	        y: {
	            min: -5,
	            max: 5,
	            pixelCount: 800,
	            origin: 500
	        },
	        isRefreshing: true
		};
		this.finds = {
			x: this.general.x.min,
	        y: 0,
	        prev_x: 0,
	        prev_y: 0,
	        dx: 0.1,
	        kP: 1
		}
		this.f;
		this.dPixel = 2; this.dx; this.dy; this.prev_dy; this.d2y; this.prev_d2y;
		this.inv_dx, this.inv_dy, this.x, this.prev_x, this.y, this.prev_y;
	}
	render(){
		return (
			<canvas 
				id={this.props.id}
				onMouseMove={this.mousemove}
			/>
		);
	}
	componentDidMount(){
		this.canvas = document.getElementById(this.props.id);
		this.ctx = this.canvas.getContext('2d');
	}
	graph(_f){
		this.f = _f;
		try {
			this.recalculate();
			this.axes();
			this.plot();
			this.border();
		} catch (err){
			console.log(err);
			this.axes();
			this.border();
		}
	}
	resize(_width, _height){
		this.canvas.width = _width;
		this.canvas.height = _height;
	}
	drawLine(_){
		this.ctx.beginPath();
		this.ctx.strokeStyle = _.strokeStyle;
		this.ctx.lineWidth = _.strokeWidth;
		this.ctx.moveTo(_.x1, _.y1);
		this.ctx.lineTo(_.x2, _.y2);
		this.ctx.stroke();
	}
	color(_color){
		this.ctx.fillStyle = _color;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}
	set_dPixel(_){
		this.dPixel = _;
	}
	recalculate(){
		this.general.x.pixelCount = this.canvas.width;
		this.general.y.pixelCount = this.canvas.height;
		this.general.x.origin = ((0 - this.general.x.min) / (this.general.x.max - this.general.x.min)) * this.general.x.pixelCount;

		this.general.y.min = (this.general.y.origin / this.general.x.origin) * this.general.x.min;
		this.general.y.max = (this.general.y.origin / this.general.x.origin) * this.general.x.max;
        this.general.y.origin = ((this.general.y.max) / (this.general.y.max - this.general.y.min)) * (this.general.y.pixelCount);

        this.dx = (this.dPixel * (this.general.x.max - this.general.x.min)) / this.general.x.pixelCount;
        this.dy = (this.dPixel * (this.general.y.max - this.general.y.min)) / this.general.y.pixelCount;
        this.prev_dy = this.dy;

        this.inv_dx = this.dPixel/this.dx;
        this.inv_dy = this.dPixel/this.dy;

        this.x = this.general.x.min;
        this.prev_x = this.general.x.min - this.dx;

        this.y = math.eval(this.f,{"x": this.x});
        this.prev_y = math.eval(this.f, {"x": this.prev_x});
	}
	axes(){
		let count = 0;
		for(let i = this.general.x.origin; i < this.general.x.pixelCount; i += this.inv_dx){
			if(!(count % 2)){
	            this.drawLine({
	                strokeStyle: "#000000",
	                strokeWidth: 0.5,
	                x1: i, y1: 0,
	                x2: i, y2: this.general.y.pixelCount
	            });
        	} else {
        		this.drawLine({
	                strokeStyle: "#aaaaaa",
	                strokeWidth: 0.5,
	                x1: i, y1: 0,
	                x2: i, y2: this.general.y.pixelCount
	            });
        	}
        	count++;
        }
        count = 0;
        for(let i = this.general.x.origin; i > 0; i -= this.inv_dx){
            if(!(count % 2)){
            	this.drawLine({
	                strokeStyle: "#000000",
	                strokeWidth: 0.5,
	                x1: i, y1: 0,
	                x2: i, y2: this.general.y.pixelCount
           		});
            } else {
	            this.drawLine({
	                strokeStyle: "#aaaaaa",
	                strokeWidth: 0.5,
	                x1: i, y1: 0,
	                x2: i, y2: this.general.y.pixelCount
	            });
        	}
        	count++;
        }
        count = 0;
        for(let i = this.general.y.origin; i < this.general.y.pixelCount; i += this.inv_dy){
        	if(!(count % 2)){
	            this.drawLine({
	                strokeStyle: "#000000",
	                strokeWidth: 0.5,
	                x1: 0, y1: i,
	                x2: this.general.x.pixelCount, y2: i
	            });
        	} else {
        		this.drawLine({
	                strokeStyle: "#aaaaaa",
	                strokeWidth: 0.5,
	                x1: 0, y1: i,
	                x2: this.general.x.pixelCount, y2: i
	            });
        	}
        	count++;
        }
        count = 0;
        for(let i = this.general.y.origin; i > 0; i -= this.inv_dy){
        	if(!(count % 2)){
	            this.drawLine({
	                strokeStyle: "#000000",
	                strokeWidth: 0.5,
	                x1: 0, y1: i,
	                x2: this.general.x.pixelCount, y2: i
	            });
        	} else {
        		this.drawLine({
	                strokeStyle: "#aaaaaa",
	                strokeWidth: 0.5,
	                x1: 0, y1: i,
	                x2: this.general.x.pixelCount, y2: i
	            });
        	}
        	count++;
        }
		this.drawLine({
            strokeStyle: "#000000",
            strokeWidth: 1.5,
            x1: this.general.x.origin, y1: 0,
            x2: this.general.x.origin, y2: this.canvas.height
        });
        this.drawLine({
            strokeStyle: "#000000",
            strokeWidth: 1.5,
            x1: 0, y1: this.general.y.origin,
            x2: this.canvas.width, y2: this.general.y.origin
        });
	}
	border(){
		this.drawLine({
            strokeStyle: "#ffffff",
            strokeWidth: 10,
            x1: 5, y1: 0,
            x2: 5, y2: this.canvas.height
        });
        this.drawLine({
            strokeStyle: "#ffffff",
            strokeWidth: 10,
            x1: 0, y1: 5,
            x2: this.canvas.width, y2: 5
        });
        this.drawLine({
            strokeStyle: "#ffffff",
            strokeWidth: 10,
            x1: this.canvas.width - 5, y1: 0,
            x2: this.canvas.width - 5, y2: this.canvas.height
        });
        this.drawLine({
            strokeStyle: "#ffffff",
            strokeWidth: 10,
            x1: 0, y1: this.canvas.height - 5,
            x2: this.canvas.width, y2: this.canvas.height - 5
        });
	}
	plot(){
		while(this.x < this.general.x.max){
            this.y = math.eval(this.f,{"x": this.x});
            this.dy = this.y - this.prev_y;
            this.d2y = this.dy - this.prev_dy;

            this.drawLine({
                strokeStyle: "#0000ff",
                strokeWidth: 3,
                x1: (this.prev_x * this.inv_dx + this.general.x.origin), y1: ((this.prev_y * -this.inv_dy + this.general.y.origin)),
                x2: (this.x * this.inv_dx + this.general.x.origin), y2: ((this.y * -this.inv_dy + this.general.y.origin))
            });

            // if(document.getElementById("f'(x)").checked){
                this.drawLine({
                    strokeStyle: "#ff0000",
                    strokeWidth: 3,
                    x1: (this.prev_x * this.inv_dx + this.general.x.origin), y1: ((this.prev_dy/this.dx) * -this.inv_dy + this.general.y.origin),
                    x2: (this.x * this.inv_dx + this.general.x.origin), y2: ((this.dy/this.dx) * -this.inv_dy + this.general.y.origin)
                });
            // }

            // if(document.getElementById("f''(x)").checked){
                this.drawLine({
                    strokeStyle: "#00ff00",
                    strokeWidth: 3,
                    x1: (this.prev_x * this.inv_dx + this.general.x.origin), y1: ((this.prev_d2y/(this.dx * this.dx)) * -this.inv_dy + this.general.y.origin),
                    x2: (this.x * this.inv_dx + this.general.x.origin), y2: ((this.d2y/(this.dx * this.dx)) * -this.inv_dy + this.general.y.origin)
                });
            // }

            this.prev_x = this.x;
            this.prev_y = this.y;
            this.prev_dy = this.dy;		
            this.prev_d2y = this.d2y;
            this.x += this.dx;
        }
	}
	fullscreen(){
		this.resize((document.getElementById("graphDIV").offsetWidth - 5),
					(window.innerHeight - document.getElementById("graphDIV").offsetTop - 15));
		this.resize((document.getElementById("graphDIV").offsetWidth - 5),
					(window.innerHeight - document.getElementById("graphDIV").offsetTop - 15));
	}
	fzeros(){
		return brent(this.general.x.min, this.general.x.max, 100, this.f);
	}
	mousemove(e){
		// TO BE OVERRIDDEN
	}
};