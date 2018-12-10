import math from "mathjs";
import Mu from "./Mu.js";

const brent = (lower,upper,intervals,f) => {

	let mu = new Mu();

	let epsilon = 0.0000000000001;  // When abs(b - a) is less than this number, they have converged enough to call b the zero.
	const brent_alg = (a,b) => {  // This is the actual algorithm. This function will be called multiple times later.
		let count = 0;
		let f_a = mu.evaluate(f, {x: a});
		let f_b = mu.evaluate(f, {x: b});
		let s, f_s;
		let d;
		if(f_a * f_b > 0) return NaN;  // Interval does not include a zero, IVT does not apply.
		if(Math.abs(f_a) < Math.abs(f_b)){  // b needs to be closer to the zero.
			let z = a;
			a = b;
			b = z;
		}
		let c = a, f_c;
		let mflag = true;
		while(!(f_b == 0 || (Math.abs(b - a) < epsilon))){
			f_a = mu.evaluate(f, {x: a});
			f_b = mu.evaluate(f, {x: b});
			f_c = mu.evaluate(f, {x: b});

			if(f_a != f_c && f_b != f_c){
				s = (a * f_b * f_c) / ((f_a - f_b) * (f_a - f_c)) + 
					(b * f_a * f_c) / ((f_b - f_a) * (f_b - f_c)) +
					(c * f_a * f_b) / ((f_c - f_a) * (f_c - f_b));  // Inverse Quadratic Interpolation.
			} else {
				s = b - (f_b * ((b - a) / (f_b - f_a)));  // Secant Method.
			}

			if( !((s < ((3*a + b)/4) && s > b) || (s > ((3*a + b)/4) && s < b)) ||
				(mflag  && (Math.abs(s - b) >= (Math.abs(b - c) / 2))) ||
				(!mflag && (Math.abs(s - b) >= (Math.abs(c - d) / 2))) ||
				(mflag  && (Math.abs(b - c)  <  Math.abs(epsilon)))    ||
				(!mflag && (Math.abs(c - d)  <  Math.abs(epsilon))) 
			) {
				s = (a + b) / 2;  // Bisection Method.
				mflag = true;
			} else {
				mflag = false;
			}

			f_s = mu.evaluate(f,{x: s});
			d = c;
			c = b;

			if(f_a * f_s < 0) b = s;
			else a = s;

			count++;
			if(count > 100){
				return NaN;
			}
		}
		return b;
	}

	let key = "" + f + ", (" + lower + ", " + upper + ") , " + intervals;
	let cache = JSON.parse(localStorage.getItem("brent"));

	if(cache == undefined){
		cache = {};
	}
	if(cache[key] == undefined){
		cache[key] = [];
		let rootsIndex = 0;
		let numbersPerInterval = (upper - lower) / intervals;

		for(let i = 0; i < intervals; i++){
			let meme = brent_alg( lower + (numbersPerInterval * i) , lower + (numbersPerInterval * (i + 1)) );
			let m = (Math.abs(meme - cache[key][rootsIndex]));
			let e = mu.evaluate(f, {x: meme});
			if(!(typeof meme === 'object') && !isNaN(meme) && !(meme == undefined) && (Math.abs(e) < 0.00001 || isNaN(e)) && (isNaN(m) || (m > epsilon))){
				cache[key][rootsIndex] = meme;
				rootsIndex++;
			}
		}

		localStorage.setItem("brent", JSON.stringify(cache));
	} else {
		console.log("localstorage hype")
	}

	mu.push();
	return cache[key];
}

export default brent;