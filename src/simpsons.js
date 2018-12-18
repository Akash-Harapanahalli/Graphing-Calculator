import Mu from './Mu.js';

// Simpson's rule implemented, following the formula.

const simpsons = (lower, upper, intervals, f) => {
    let mu = new Mu();
    let dx = (upper - lower) / intervals;
    let mult = 4;
    let integral = 0;

    integral += mu.evaluate(f, {x: lower});
    integral += mu.evaluate(f, {x: upper});

    for(let i = lower + dx; i <= upper - dx; i+=dx){
        if(mult == 4) mult = 2;
        else mult = 4;
        integral += mult * mu.evaluate(f, {x: i});
    }

    return (dx * integral / 3);
}

export default simpsons;