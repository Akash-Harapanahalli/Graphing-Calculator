import React from "react";

import math from "mathjs";
import brent from "./brent.js";

export default class Graph extends React.Component {
	constructor(props){
		super(props);
		this.canvas;
		this.ctx;
		this.container;
		this.mousemove;
		this.progress;
		this.general = {
			x: {
	            min: -10,
	            max: 10,
	            pixelCount: 1000,
	            origin: 500
	        },
	        y: {
	            min: -10,
	            max: 10,
	            pixelCount: 800,
	            origin: 500
	        },
	        isRefreshing: true,
	        f_: true,
	        f__: true
		};
		this.cache = {};
		// this.finds = {
		// 	x: this.general.x.min,
	 //        y: 0,
	 //        prev_x: 0,
	 //        prev_y: 0,
	 //        dx: 0.1,
	 //        kP: 1
		// }
		this.f;
		this.dPixel = 2; this.dx; this.dy; this.prev_dy; this.d2y; this.prev_d2y;
		this.inv_dx, this.inv_dy, this.x, this.prev_x, this.y, this.prev_y;

		this.f_;
		this.temp;

		this.values;
		this.p;
		// this.f_ = function(_){
		// 	(math.eval(f, {x: (_ + this.dx)}) - math.eval(f, {x: (_ + this.dx)})) / this.dx;
		// }
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
		this.container = document.getElementById(this.props.container);
	}
	graph(_f){
		this.progress.setProgress(0);
		this.f = _f;
		this.fullscreen();
		try {
			this.recalculate();
			this.progress.setProgress(10);
			this.plot();
			this.progress.setProgress(50);
			// console.log("graphed");

		} catch (err){
			console.log(err);
			this.axes();
			this.border();
		}
		this.axes();
		this.progress.setProgress(55);
		this.border();
		this.progress.setProgress(60);

		console.log("boutta halt");
	}
	delayed(){
		this.f_ = "((" + (this.f).replace(/x/g, ("(x + " + 0.00000001 + ")")) + ") - (" + (this.f) + ")) / " + 0.00000001;
		this._f = "1 / (" + this.f + ")";
		this.temp = this.points();
		
		this.label();
		this.progress.setProgress(80);
		this.axes();
		this.progress.setProgress(90);
		this.border();
		this.progress.setProgress(100);

		return this.temp;
	}
	resize(_width, _height){
		this.canvas.width = _width;
		this.canvas.height = _height;
	}
	drawLine(_){
		this.ctx.beginPath();
		this.ctx.strokeStyle = _.strokeStyle;
		this.ctx.lineWidth = _.strokeWidth;
		this.ctx.setLineDash([0]);
		this.ctx.moveTo(_.x1, _.y1);
		this.ctx.lineTo(_.x2, _.y2);
		this.ctx.stroke();
	}
	drawDotted(_){
		this.ctx.beginPath();
		this.ctx.strokeStyle = _.strokeStyle;
		this.ctx.lineWidth = _.strokeWidth;
		this.ctx.setLineDash([6]);
		this.ctx.moveTo(_.x1, _.y1);
		this.ctx.lineTo(_.x2, _.y2);
		this.ctx.stroke();
	}
	drawCircle(_){
		this.ctx.beginPath();
		this.ctx.strokeStyle = _.strokeStyle;
		this.ctx.lineWidth = _.strokeWidth;
		this.ctx.arc(_.x, _.y, _.radius, 0, 2 * Math.PI);

		this.ctx.fillStyle = _.fillStyle;

		this.ctx.fill();
		this.ctx.stroke();
	}
	color(_color){
		this.ctx.fillStyle = _color;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}
	set_dPixel(_){
		this.dPixel = _;
	}
	setValues(_){
		this.dPixel = math.eval("0 + " + _.dPixel);
		this.general.x.min = math.eval("0 + " + _.xMin);
		this.general.x.max = math.eval("0 + " + _.xMax);
		this.general.y.min = math.eval("0 + " + _.yMin);
		this.general.y.max = math.eval("0 + " + _.yMax);
		this.general.f_ = _.f_;
		this.general.f__ = _.f__;
	}
	writeText(text, x, y) {
		this.ctx.fillStyle = "#000000";
		this.ctx.font = "black 20px Arial"
		this.ctx.fillText(text, x, y); 
	}
	recalculate(){
		this.general.x.pixelCount = this.canvas.width;
		this.general.y.pixelCount = this.canvas.height;
		this.general.x.origin = ((0 - this.general.x.min) / (this.general.x.max - this.general.x.min)) * this.general.x.pixelCount;
        this.general.y.origin = ((this.general.y.max) / (this.general.y.max - this.general.y.min)) * (this.general.y.pixelCount);

		this.dx = (this.dPixel * (this.general.x.max - this.general.x.min)) / this.general.x.pixelCount;
		// console.log("dx = " + this.dx);
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
		let scalar = {
			x: Math.ceil(( (this.general.x.max - this.general.x.min) * 50 ) / this.canvas.width),
			y: Math.ceil(( (this.general.y.max - this.general.y.min) * 50 ) / this.canvas.height)
		}
		let pixels = {
			x: this.inv_dx * scalar.x,
			y: this.inv_dy * scalar.y
		}
		for(let i = this.general.x.origin; i < this.general.x.pixelCount; i += pixels.x){
			if(!(count % 2)){
	            this.drawLine({
	                strokeStyle: "#000000",
	                strokeWidth: 0.5,
	                x1: i, y1: 0,
	                x2: i, y2: this.general.y.pixelCount
	            });
	            this.writeText((count * scalar.x), i + 5, this.general.y.origin + 12);
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
        for(let i = this.general.x.origin; i > 0; i -= pixels.x){
            if(!(count % 2)){
            	this.drawLine({
	                strokeStyle: "#000000",
	                strokeWidth: 0.5,
	                x1: i, y1: 0,
	                x2: i, y2: this.general.y.pixelCount
           		});
           		if(count != 0){
           			this.writeText(-(count * scalar.x), i + 5, this.general.y.origin + 12);
           		}
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
        for(let i = this.general.y.origin; i < this.general.y.pixelCount; i += pixels.y){
        	if(!(count % 2)){
	            this.drawLine({	
	                strokeStyle: "#000000",
	                strokeWidth: 0.5,
	                x1: 0, y1: i,
	                x2: this.general.x.pixelCount, y2: i
	            });
	            if(count != 0){
           			this.writeText((count * scalar.y), this.general.x.origin + 5, i + 13);
           		}
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
        for(let i = this.general.y.origin; i > 0; i -= pixels.y){
        	if(!(count % 2)){
	            this.drawLine({
	                strokeStyle: "#000000",
	                strokeWidth: 0.5,
	                x1: 0, y1: i,
	                x2: this.general.x.pixelCount, y2: i
	            });
	            if(count != 0){
	            	this.writeText(-(count * scalar.y), this.general.x.origin + 5, i + 13);
	        	}
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
		if(this.isEmpty(this.cache[this.f])){
			this.cache[this.f] = {
				meme: 0
			};
			// console.log("remade");
		}
		while(this.x < this.general.x.max){
			if(this.cache[this.f][this.x] != undefined || this.cache[this.f][this.x]){
            	this.y = this.cache[this.f][this.x];
        	} else {
        		this.y = math.eval(this.f,{"x": this.x});
        		this.cache[this.f][this.x] = this.y;
        		// console.log("calculated");
			}
			this.y = math.eval(this.f,{"x": this.x});
			// console.log(this.y);
			if(this.y == undefined || !this.y || isNaN(this.y)){
				this.y = this.general.x.min - 10;
			}
            this.dy = this.y - this.prev_y;
            this.d2y = this.dy - this.prev_dy;

			if((this.prev_y > this.y && this.prev_y > this.general.y.max && this.y < this.general.y.min) || (this.prev_y < this.y && this.prev_y < this.general.y.min && this.y > this.general.y.max)){
			} else {
				this.drawLine({
					strokeStyle: "#0000ff",
					strokeWidth: 3,
					x1: (this.prev_x * this.inv_dx + this.general.x.origin), y1: ((this.prev_y * -this.inv_dy + this.general.y.origin)),
					x2: (this.x * this.inv_dx + this.general.x.origin), y2: ((this.y * -this.inv_dy + this.general.y.origin))
				});
			}

            if(this.general.f_ && this.y != undefined && typeof this.y !== "object"){
				if((this.prev_dy > this.dy && this.prev_dy > this.general.y.max && this.dy < this.general.y.min) || (this.prev_dy < this.dy && this.prev_dy < this.general.y.min && this.dy > this.general.y.max)){
				} else {
					this.drawLine({
						strokeStyle: "#ff0000",
						strokeWidth: 3,
						x1: (this.prev_x * this.inv_dx + this.general.x.origin), y1: ((this.prev_dy/this.dx) * -this.inv_dy + this.general.y.origin),
						x2: (this.x * this.inv_dx + this.general.x.origin), y2: ((this.dy/this.dx) * -this.inv_dy + this.general.y.origin)
					});
				}
            }

            if(this.general.f__){
				if((this.prev_d2y > this.d2y && this.prev_d2y > this.general.y.max && this.d2y < this.general.y.min) || (this.prev_d2y < this.d2y && this.prev_d2y < this.general.y.min && this.d2y > this.general.y.max)){
				} else {
					this.drawLine({
						strokeStyle: "#00ff00",
						strokeWidth: 3,
						x1: (this.prev_x * this.inv_dx + this.general.x.origin), y1: ((this.prev_d2y/(this.dx * this.dx)) * -this.inv_dy + this.general.y.origin),
						x2: (this.x * this.inv_dx + this.general.x.origin), y2: ((this.d2y/(this.dx * this.dx)) * -this.inv_dy + this.general.y.origin)
					});
				}
            }

            this.prev_x = this.x;
            this.prev_y = this.y;
            this.prev_dy = this.dy;		
            this.prev_d2y = this.d2y;
            this.x += this.dx;
        }
        // console.log(this.cache);
	}
	isEmpty(obj) {
	    for(var key in obj) {
	        if(obj.hasOwnProperty(key))
	            return false;
	    }
	    return true;
	}
	fullscreen(){
		this.resize((this.container.offsetWidth - 5),
					(window.innerHeight - this.container.offsetTop - 15));
		this.resize((this.container.offsetWidth - 5),
					(window.innerHeight - this.container.offsetTop - 15));
	}
	fzeros(){
		return brent(this.general.x.min, this.general.x.max, 100, this.f);
	}
	f_zeros(){
		return brent(this.general.x.min, this.general.x.max, 500, this.f_);
	}
	_fzeros(){
		return brent(this.general.x.min, this.general.x.max, 100, this._f);
	}
	points(){
		// console.log("Points Coming up");
		this.values = {
			zeros: this.fzeros(),
			crit: this.f_zeros(),
			inv: this._fzeros()
		};
		// console.log(this.values);

		let r = [], index = 0;
		for(let i = 0; i < this.values.zeros.length; i++){
			let a = {};
			a.x = this.values.zeros[i];
			a.y = "0";
			a.type = "Zero";
			let tmp = math.eval(this.f, {x: a.x});
			if(tmp > 0.000001 || tmp < 0.000001){
				r[index] = a;
				index++;
			}
		}

		for(let i = 0; i < this.values.crit.length; i++){
			let a = {};
			a.x = this.values.crit[i];
			a.y = (math.eval(this.f, {x: a.x}));
			if(!isNaN(a.y)){
				a.y = (a.y).toString();
				a.type = "Critical Number";
				r[index] = a;
				index++;
			}
		}
		for(let i = 0; i < this.values.inv.length; i++){
			let a = {};
			a.x = this.values.inv[i];
			a.y = math.eval(this.f, {x: a.x});
			if(isNaN(a.y)){
				a.type = "Hole";
				a.y = (math.eval(this.f, {x: a.x - this.dx})).toString();
			} else {
				a.type = "Asymtote";
				a.y = undefined;
			}
			r[index] = a;
			index++;
		}

		this.p = r;

		return r;
	}
	label(){
		for(let i = 0; i < this.p.length; i++){
			if(this.p[i].type == "Asymtote"){
				this.drawDotted({
					strokeStyle: "#0000ff",
					strokeWidth: 3,
					x1: this.p[i].x * this.inv_dx + this.general.x.origin, y1: this.canvas.height,
					x2: this.p[i].x * this.inv_dx + this.general.x.origin, y2: 0
				});
				// console.log("Graphed asymtote");
				// console.log("x: " + this.p[i].x)
			} else if(this.p[i].type == "Hole"){
				this.drawCircle({
					strokeStyle: "#0000ff",
					fillStyle: "#ffffff",
					strokeWidth: 2,
					x: this.p[i].x * this.inv_dx + this.general.x.origin, y: this.p[i].y * -this.inv_dy + this.general.y.origin, radius: 8
				});
			} else if(this.p[i].type == "Critical Number" || this.p[i].type == "Zero"){
				this.drawCircle({
					strokeStyle: "#0000ff",
					fillStyle: "#0000ff",
					strokeWidth: 2,
					x: this.p[i].x * this.inv_dx + this.general.x.origin, y: this.p[i].y * -this.inv_dy + this.general.y.origin, radius: 5
				});
			}
		}
	}
	mousemove(e){
		// TO BE OVERRIDDEN
	}
};