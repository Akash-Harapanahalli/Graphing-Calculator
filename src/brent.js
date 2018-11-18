import math from "mathjs";

const brent = (lower,upper,intervals,f) => {
	let epsilon = 0.000000000001;  // When abs(b - a) is less than this number, they have converged enough to call b the zero.
	const brent_alg = (a,b) => {  // This is the actual algorithm. This function will be called multiple times later.
		let count = 0;
		let f_a = math.eval(f, {x: a});
		let f_b = math.eval(f, {x: b});
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
			f_a = math.eval(f, {x: a});
			f_b = math.eval(f, {x: b});
			f_c = math.eval(f, {x: b});

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

			f_s = math.eval(f,{x: s});
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

	let roots = [];
	let rootsIndex = 0;
	let numbersPerInterval = (upper - lower) / intervals;

	for(let i = 0; i < intervals; i++){
		let meme = brent_alg( lower + (numbersPerInterval * i) , lower + (numbersPerInterval * (i + 1)) );
		if(!(typeof meme === 'object') || !(isNaN(meme) || meme == undefined || Math.abs(math.eval(f, {x: meme})) > 0.00001 || (Math.abs(meme - roots[rootsIndex - 1]) < epsilon))){
			roots[rootsIndex] = meme;
			rootsIndex++;
		}
	}
	return roots;
}

export default brent;