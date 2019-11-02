import React from "react";

import brent from "./brent.js";
import simpsons from "./simpsons.js";
import Mu from "./Mu.js";

/**
 * A hand-written Graph elemnent!
 * Graphs axes, lines, function, 2 derivatives out, and more.
 * Makes calls to brent, mu, and simpsons.
 */

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
			ftc: {
				min: -10,
				max: 10
			},
	        isRefreshing: true,
	        f_: true,
	        f__: true
		};
		this.f; this.f_; this.f__; this._f;
		this.integral;
		this.dPixel = 1; this.dx; this.dy; this.prev_dy; this.d2y; this.prev_d2y;
		this.inv_dx, this.inv_dy, this.x, this.prev_x, this.y, this.prev_y;

		this.temp;

		this.values;
		this.p;

		this.timeout;

		this.selected = [];

		this.mu = new Mu();

		this.drag = {
			init: {
				x: 0,
				y: 0,
				boxes: {}
			},
			during: {
				x: 0,
				y: 0
			},
			isDown: false
		}
	}
	render(){
		return (
			<canvas 
				id={this.props.id}
				onMouseDown={(e) => {this.mouseDown(e)}}
				onMouseUp={(e) => {this.mouseUp(e)}}
				onMouseMove={(e) => {this.mouseMove(e)}}
			/>
		);
	}
	componentDidMount(){
		this.canvas = document.getElementById(this.props.id);
		this.ctx = this.canvas.getContext('2d');
		this.container = document.getElementById(this.props.container);
		let ctx = this;
		this.canvas.addEventListener('wheel',function(e){
			ctx.scroll(e);
			return false; 
		}, false);	}
	graph(_f){
		this.mu.pull();
		document.getElementById('integral').textContent = "";
		document.getElementById('integral2').textContent = "";

		if(this.drag.isDown) this.dPixel = 2;
		else this.dPixel = 1;

		this.f = _f;
		this.fullscreen();
		try {
			this.recalculate();
			this.plot();
		} catch (err){
			console.log(err);
			this.axes();
			this.border();
		}
		this.axes();
		this.border();
	}
	delayed(_){
		if(!this.drag.isDown){
			this.selected = _;
			this.f_ = "((" + (this.f).replace(/x/g, ("(x + 0.01)")) + ") - (" + (this.f) + ")) / 0.01";
			this.f__ = "((" + (this.f_).replace(/x/g, ("(x + 0.01)")) + ") - (" + (this.f_) + ")) / 0.01";
			this._f = "1 / (" + this.f + ")";
			this.temp = this.points();
			
			this.label();
			this.axes();
			this.border();

			this.mu.push();
			return this.temp;
		} else {
			return [];
		}

	}
	integrate(){
		// Integration! Not as portable as I would like.

		let int_f_ = ("int(f'(x), " + this.general.ftc.min + ", " + this.general.ftc.max + ") = " + simpsons(this.general.ftc.min, this.general.ftc.max, 10000, this.f_));
		let diff_f_f = ("f(" + this.general.ftc.max + ") - f(" + this.general.ftc.min + ") = " + (this.mu.evaluate(this.f, {x: this.general.ftc.max}) - this.mu.evaluate(this.f, {x: this.general.ftc.min})));
		document.getElementById('integral').textContent = "" + int_f_;
		document.getElementById('integral2').textContent = "" + diff_f_f;
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
		this.general.x.min = this.mu.evaluate("0 + " + _.xMin);
		this.general.x.max = this.mu.evaluate("0 + " + _.xMax);
		this.general.y.min = this.mu.evaluate("0 + " + _.yMin);
		this.general.y.max = this.mu.evaluate("0 + " + _.yMax);
		this.general.ftc.min = this.mu.evaluate("0 + " + _.ftcmin);
		this.general.ftc.max = this.mu.evaluate("0 + " + _.ftcmax);
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
        this.dy = (this.dPixel * (this.general.y.max - this.general.y.min)) / this.general.y.pixelCount;
        this.canvdy = this.dy;
        this.prev_dy = this.dy;

        this.inv_dx = this.dPixel/this.dx;
        this.inv_dy = this.dPixel/this.dy;

        this.x = this.general.x.min;
        this.prev_x = this.general.x.min - this.dx;

        this.y = this.mu.evaluate(this.f,{"x": this.x});
        this.prev_y = this.mu.evaluate(this.f, {"x": this.prev_x});
	}
	axes(){
		let count = 0;
		let scalar = {
			x: ( (this.general.x.max - this.general.x.min) * 50 ) / this.canvas.width,
			y: ( (this.general.y.max - this.general.y.min) * 50 ) / this.canvas.height
		}
		if(scalar.x <= 0.5){
			let m = scalar.x;
			let _m = 1 / m;
			_m = Math.ceil(_m);
			scalar.x = 1 / _m;
		} else scalar.x = Math.ceil(scalar.x);
		if(scalar.y <= 0.5){
			let m = scalar.y;
			let _m = 1 / m;
			_m = Math.ceil(_m);
			scalar.y = 1 / _m;
		} else scalar.y = Math.ceil(scalar.y);
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
			this.y = this.mu.evaluate(this.f,{"x": this.x});
			if(this.y == undefined || !this.y || isNaN(this.y)){
				this.y = this.general.x.min - 10;
			}
            this.dy = this.y - this.prev_y;
			this.d2y = this.dy - this.prev_dy;
			
			// PLOTTING THE FUNCTION!
			if((this.prev_y > this.y && this.prev_y > this.general.y.max && this.y < this.general.y.min) || (this.prev_y < this.y && this.prev_y < this.general.y.min && this.y > this.general.y.max)){
			} else {
				this.drawLine({
					strokeStyle: "#0000ff",
					strokeWidth: 3,
					x1: (this.prev_x * this.inv_dx + this.general.x.origin), y1: ((this.prev_y * -this.inv_dy + this.general.y.origin)),
					x2: (this.x * this.inv_dx + this.general.x.origin), y2: ((this.y * -this.inv_dy + this.general.y.origin))
				});
			}

			// PLOTTING THE DERIVATIVE!
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

			// PLOTTING THE SECOND DERIVATIVE!
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
		return brent(this.general.x.min, this.general.x.max, 200, this.f_);
	}
	f__zeros(){
		return brent(this.general.x.min, this.general.x.max, 400, this.f__);
	}
	_fzeros(){
		return brent(this.general.x.min, this.general.x.max, 100, this._f);
	}
	points(){
		// console.log("Points Coming up");
		this.values = {
			zeros: this.fzeros(),
			crit: this.f_zeros(),
			inf: this.f__zeros(),
			rec: this._fzeros()
		};
		// console.log(this.values);

		let r = [], index = 0;
		for(let i = 0; i < this.values.zeros.length; i++){
			let a = {};
			a.x = this.values.zeros[i];
			a.y = "0";
			a.type = "Zero";
			let tmp = this.mu.evaluate(this.f, {x: a.x});
			if(tmp > 0.000001 || tmp < 0.000001){
				r[index] = a;
				index++;
			}
		}

		for(let i = 0; i < this.values.crit.length; i++){
			let a = {};
			a.x = this.values.crit[i];
			a.y = (this.mu.evaluate(this.f, {x: a.x}));
			if(!isNaN(a.y)){
				let yp = this.mu.evaluate(this.f, {x: a.x - 0.0001});
				let ya = this.mu.evaluate(this.f, {x: a.x + 0.0001});
				if(a.y > yp && a.y < ya){
					a.y = (a.y).toString();
					a.type = "Relative Maximum";
					r[index] = a;
					index++;
				} 
				if (a.y < yp && a.y > ya){
					a.y = (a.y).toString();
					a.type = "Relative Minimum";
					r[index] = a;
					index++;
				}
			}
		}

		for(let i = 0; i < this.values.inf.length; i++){
			let a = {};
			a.x = this.values.inf[i];
			a.y = (this.mu.evaluate(this.f, {x: a.x}));
			if(!isNaN(a.y)){
				let y_ =  this.mu.evaluate(this.f_, {x: a.x});
				let y_p = this.mu.evaluate(this.f_, {x: a.x - 0.001});
				let y_a = this.mu.evaluate(this.f_, {x: a.x + 0.001});
				if(y_ > y_p && y_ < y_a){
					a.y = (a.y).toString();
					a.type = "Point of Inflection";
					r[index] = a;
					index++;
				} 
				if (y_ < y_p && y_ > y_a){
					a.y = (a.y).toString();
					a.type = "Point of Inflection";
					r[index] = a;
					index++;
				}
			}
		}

		for(let i = 0; i < this.values.rec.length; i++){
			let a = {};
			a.x = this.values.rec[i];
			a.y = this.mu.evaluate(this.f, {x: a.x});
			if(!(typeof a.y === 'object')){
				if(isNaN(a.y) ){
					a.type = "Hole";
					a.y = (this.mu.evaluate(this.f, {x: a.x - 0.01})).toString();
				} else {
					a.type = "Asymptote";
					a.y = undefined;
				}
				r[index] = a;
				index++;
			}
		}

		this.p = r;

		return r;
	}
	label(){
		let i = 0;
		for(let j = 0; j < this.selected.length; j++){
			i = this.selected[j];
			if(this.p[i].type == "Asymptote"){
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
			} else if(this.p[i].type == "Relative Maximum" || this.p[i].type == "Relative Minimum"  ){
				this.drawCircle({
					strokeStyle: "#ff0000",
					fillStyle: "#ff0000",
					strokeWidth: 2,
					x: this.p[i].x * this.inv_dx + this.general.x.origin, y: this.p[i].y * -this.inv_dy + this.general.y.origin, radius: 5
				});
			} else if (this.p[i].type == "Zero"){
				this.drawCircle({
					strokeStyle: "#0000ff",
					fillStyle: "#0000ff",
					strokeWidth: 2,
					x: this.p[i].x * this.inv_dx + this.general.x.origin, y: this.p[i].y * -this.inv_dy + this.general.y.origin, radius: 5
				});
			} else if (this.p[i].type == "Point of Inflection"){
				this.drawCircle({
					strokeStyle: "#00ff00",
					fillStyle: "#00ff00",
					strokeWidth: 2,
					x: this.p[i].x * this.inv_dx + this.general.x.origin, y: this.p[i].y * -this.inv_dy + this.general.y.origin, radius: 5
				})
			}	
		}
	}

	captureMouseDown(e, boxes){
		this.drag.init.x = e.clientX;
		this.drag.init.y = e.clientY;	
		this.drag.during.x = e.clientX;
		this.drag.during.y = e.clientY;
		this.drag.init.boxes.xMin = this.mu.evaluate(document.getElementById(boxes.xMin).value);
		this.drag.init.boxes.xMax = this.mu.evaluate(document.getElementById(boxes.xMax).value);
		this.drag.init.boxes.yMin = this.mu.evaluate(document.getElementById(boxes.yMin).value);
		this.drag.init.boxes.yMax = this.mu.evaluate(document.getElementById(boxes.yMax).value);
		this.drag.isDown = true;
	}
	captureMouseUp(e){
		this.drag.isDown = false;
	}
	captureMouseMove(e, boxes){
		this.drag.during.x = e.clientX;
		this.drag.during.y = e.clientY;
		let delta_x = (this.drag.init.x - this.drag.during.x) * this.dx / 2;
		let delta_y = (this.drag.init.y - this.drag.during.y) * this.canvdy / 2;
		document.getElementById(boxes.xMin).value = this.mu.evaluate(this.drag.init.boxes.xMin + delta_x);
		document.getElementById(boxes.xMax).value = this.mu.evaluate(this.drag.init.boxes.xMax + delta_x);
		document.getElementById(boxes.yMin).value = this.mu.evaluate(this.drag.init.boxes.yMin - delta_y);
		document.getElementById(boxes.yMax).value = this.mu.evaluate(this.drag.init.boxes.yMax - delta_y);
	}
	captureScroll(e, boxes){
		let deltaY = -e.deltaY;
		console.log(deltaY);

		if(Math.abs(deltaY) > 10){
			document.getElementById(boxes.xMin).value = this.mu.evaluate(document.getElementById(boxes.xMin).value) * (1 + deltaY / 1000);
			document.getElementById(boxes.xMax).value = this.mu.evaluate(document.getElementById(boxes.xMax).value) * (1 + deltaY / 1000);
			document.getElementById(boxes.yMin).value = this.mu.evaluate(document.getElementById(boxes.yMin).value) * (1 + deltaY / 1000);
			document.getElementById(boxes.yMax).value = this.mu.evaluate(document.getElementById(boxes.yMax).value) * (1 + deltaY / 1000);
		}
	}

	// Event Captures to be overriden in a broader scope.
	mouseDown(e){}
	mouseUp(e){}
	mouseMove(e){}
	scroll(e){}
};