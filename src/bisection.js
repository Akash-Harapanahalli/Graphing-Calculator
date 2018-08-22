const bisection = (lower, upper, intervals, f) => {
	let epsilon = 0.00001;
	const bisection_alg = (a,b) => {
		let f_a = f(a), f_b = f(b);
		let c, f_c;
		if(f_a * f_b > 0) return NaN; // f(a) and f(b) are the same sign.
		let count = 0;
		while(count < 1000){
			c = (a + b) / 2;
			f_c = f(c);
			if(Math.abs(f_c) < epsilon) return c;
			if(f_a * f_c > 0) a = c;
			else b = c;
			count++;
		}
		return NaN;
	}

	return bisection_alg(lower,upper);
}

export default bisection;